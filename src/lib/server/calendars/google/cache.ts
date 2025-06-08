import { kv } from "$lib/server/utils/upstash/kv";

import type { Calendar, Event, Task } from "$lib/types";
import { KV_GOOGLE_CALENDARS, KV_GOOGLE_EVENTS, KV_GOOGLE_TASKS } from "$lib/utils/kv-keys";

import { getGoogleClients } from "./client";

export interface CachedData {
  calendars: Calendar[];
  events: Event[];
  tasks: Task[];
}

export async function cacheGoogleCalData(userId: string): Promise<CachedData> {
  const { calendar, tasks } = await getGoogleClients(userId);

  // 1. Fetch calendar list
  const calendarsRes = await calendar.calendarList.list();
  const calendarsRaw = calendarsRes.data.items ?? [];

  // 2. Fetch color metadata
  const colorsRes = await calendar.colors.get();
  const calendarColors = colorsRes.data.calendar ?? {};
  const eventColors = colorsRes.data.event ?? {};

  // 3. Map calendars
  const calendars: Calendar[] = calendarsRaw.map((cal) => ({
    id: cal.id as string,
    summary: cal.summary ?? "",
    timeZone: cal.timeZone ?? "UTC",
    backgroundColor:
      calendarColors[cal.colorId as keyof typeof calendarColors]?.background ??
      cal.backgroundColor ??
      "#9a9cff",
    accessRole: (cal.accessRole as "owner" | "reader") ?? "reader"
  }));

  await kv.set(KV_GOOGLE_CALENDARS(userId), calendars, { ex: 3600 });

  // 4. Fetch events for each calendar
  const allEvents: Event[] = [];

  for (const cal of calendarsRaw) {
    const res = await calendar.events.list({
      calendarId: cal.id as string,
      maxResults: 2500,
      singleEvents: true,
      showDeleted: false,
      orderBy: "startTime"
    });

    const events = res.data.items ?? [];

    const mapped = events
      .filter(
        (
          e
        ): e is typeof e & { start: NonNullable<typeof e.start>; end: NonNullable<typeof e.end> } =>
          !!e.start && (!!e.start.dateTime || !!e.start.date) && !!e.end
      )
      .map(
        (e): Event => ({
          id: e.id as string,
          calendarId: cal.id as string,
          summary: e.summary ?? "",
          description: e.description,
          color:
            e.colorId && eventColors[e.colorId]
              ? eventColors[e.colorId].background
              : (calendarColors[cal.colorId as keyof typeof calendarColors]?.background ??
                "#9a9cff"),
          organizer: e.organizer?.displayName
            ? { displayName: e.organizer.displayName }
            : undefined,
          start: {
            dateTime: e.start.dateTime ?? (e.start.date as string),
            timeZone: e.start.timeZone ?? cal.timeZone ?? "UTC"
          },
          end: {
            dateTime: e.end.dateTime ?? (e.end.date as string),
            timeZone: e.end.timeZone ?? cal.timeZone ?? "UTC"
          },
          reminders: e.reminders
            ? {
                useDefault: e.reminders.useDefault,
                overrides: e.reminders.overrides?.map((o) => ({
                  minutes: o.minutes ?? undefined
                }))
              }
            : undefined,
          eventType: e.eventType ?? "default"
        })
      );

    allEvents.push(...mapped);
  }

  const sortedEvents = allEvents.sort((a, b) => {
    const aTime = new Date(a.start.dateTime).getTime();
    const bTime = new Date(b.start.dateTime).getTime();
    return bTime - aTime;
  });

  await kv.set(KV_GOOGLE_EVENTS(userId), sortedEvents, { ex: 900 });

  // 5. Tasks
  const taskListsRes = await tasks.tasklists.list();
  const taskLists = taskListsRes.data.items ?? [];
  const allTasks: Task[] = [];

  for (const list of taskLists) {
    const res = await tasks.tasks.list({
      tasklist: list.id as string,
      maxResults: 100
    });

    const mapped = (res.data.items ?? []).map(
      (t): Task => ({
        id: t.id as string,
        title: t.title ?? "",
        notes: t.notes ?? undefined,
        updated: t.updated as string
      })
    );

    allTasks.push(...mapped);
  }

  await kv.set(KV_GOOGLE_TASKS(userId), allTasks, { ex: 1800 });

  return {
    calendars,
    events: sortedEvents,
    tasks: allTasks
  };
}

export async function deleteGoogleCalDataCache(userId: string) {
  await Promise.all([
    kv.del(KV_GOOGLE_CALENDARS(userId)),
    kv.del(KV_GOOGLE_EVENTS(userId)),
    kv.del(KV_GOOGLE_TASKS(userId))
  ]);
}
