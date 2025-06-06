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

  // 1. Calendars
  const calendarsRes = await calendar.calendarList.list();
  const calendarsRaw = calendarsRes.data.items ?? [];

  const calendars: Calendar[] = calendarsRaw.map((cal) => ({
    id: cal.id as string,
    summary: cal.summary ?? "",
    timeZone: cal.timeZone ?? "UTC",
    backgroundColor: cal.backgroundColor ?? "#9a9cff",
    accessRole: (cal.accessRole as "owner" | "reader") ?? "reader"
  }));

  await kv.set(KV_GOOGLE_CALENDARS(userId), calendars);

  // 2. Events
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
          summary: e.summary ?? "",
          description: e.description,
          colorId: e.colorId,
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
          reminders: e.reminders ?? {},
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

  await kv.set(KV_GOOGLE_EVENTS(userId), sortedEvents);

  // 3. Tasks
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

  await kv.set(KV_GOOGLE_TASKS(userId), allTasks);

  return {
    calendars,
    events: sortedEvents,
    tasks: allTasks
  };
}
