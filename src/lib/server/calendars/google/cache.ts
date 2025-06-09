import { kv } from "$lib/server/utils/upstash/kv";

import type { Calendar, Event, Task, UtilEvent } from "$lib/types";
import {
  KV_GOOGLE_CALENDARS,
  KV_GOOGLE_EVENTS,
  KV_GOOGLE_TASKS,
  KV_GOOGLE_UTIL_EVENTS
} from "$lib/utils/kv-keys";

import { getGoogleClients } from "./client";

export interface CachedData {
  calendars: Calendar[];
  events: Event[];
  tasks: Task[];
  utilEvents: UtilEvent[];
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
  const utilEvents: UtilEvent[] = [];

  for (const cal of calendarsRaw) {
    const res = await calendar.events.list({
      calendarId: cal.id as string,
      maxResults: 2500,
      singleEvents: true,
      showDeleted: false,
      orderBy: "startTime"
    });

    const events = res.data.items ?? [];

    for (const e of events) {
      if (!e.start || (!e.start.dateTime && !e.start.date) || !e.end) continue;

      const isAllDay = !!e.start.date && !e.start.dateTime;
      const summary = e.summary?.toLowerCase() ?? "";
      const calId = cal.id?.toLowerCase() ?? "";

      const isUtil =
        isAllDay &&
        (summary.includes("birthday") ||
          summary.includes("holiday") ||
          calId.includes("birthday") ||
          calId.includes("holiday"));

      const start = e.start.dateTime ?? (e.start.date as string);
      const end = e.end.dateTime ?? (e.end.date as string);
      const timeZone = e.start.timeZone ?? cal.timeZone ?? "UTC";

      const calendarBg =
        calendarColors[cal.colorId as keyof typeof calendarColors]?.background ?? "#9a9cff";
      const eventBg = e.colorId ? eventColors[e.colorId]?.background : null;

      const base = {
        id: e.id as string,
        calendarId: cal.id as string,
        summary: e.summary ?? "",
        description: e.description,
        color: calendarBg,
        bgColor: eventBg ?? calendarBg,
        organizer: e.organizer?.displayName ? { displayName: e.organizer.displayName } : undefined,
        date: {
          dateTime: start,
          timeZone
        }
      };

      if (isUtil) {
        const date = new Date(start);
        const mmdd = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

        const alreadyExists = utilEvents.some(
          (u) => u.summary.toLowerCase() === summary && u.date.dateTime.endsWith(mmdd)
        );

        if (!alreadyExists) {
          utilEvents.push({
            ...base,
            date: {
              dateTime: `XXXX-${mmdd}`,
              timeZone
            }
          });
        }
      } else {
        allEvents.push({
          ...base,
          start: { dateTime: start, timeZone },
          end: { dateTime: end, timeZone },
          reminders: e.reminders
            ? {
                useDefault: e.reminders.useDefault,
                overrides: e.reminders.overrides?.map((o) => ({
                  minutes: o.minutes ?? undefined
                }))
              }
            : undefined,
          eventType: e.eventType ?? "default"
        });
      }
    }
  }

  const sortedEvents = allEvents.sort((a, b) => {
    const aTime = new Date(a.start.dateTime).getTime();
    const bTime = new Date(b.start.dateTime).getTime();
    return bTime - aTime;
  });

  await Promise.all([
    kv.set(KV_GOOGLE_EVENTS(userId), sortedEvents, { ex: 900 }),
    kv.set(KV_GOOGLE_UTIL_EVENTS(userId), utilEvents, { ex: 3600 })
  ]);

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
    tasks: allTasks,
    utilEvents
  };
}

export async function deleteGoogleCalDataCache(userId: string) {
  await Promise.all([
    kv.del(KV_GOOGLE_CALENDARS(userId)),
    kv.del(KV_GOOGLE_EVENTS(userId)),
    kv.del(KV_GOOGLE_TASKS(userId))
  ]);
}
