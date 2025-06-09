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

  // 1. Calendar list
  const calendarsRes = await calendar.calendarList.list();
  const calendarsRaw = calendarsRes.data.items ?? [];

  // 2. Color metadata
  const colorsRes = await calendar.colors.get();
  const calendarColors = colorsRes.data.calendar ?? {};
  const eventColors = colorsRes.data.event ?? {};

  // 3. Normalize calendars
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

  // 4. Events + Util Events
  const allEvents: Event[] = [];

  // Helper: normalize to base holiday name (remove day off, substitute, observed, holiday suffixes/prefixes)
  const normalizeHolidayBase = (s: string) =>
    s
      .toLowerCase()
      .replace(/^day off for\s+/i, "")
      .replace(/^substitute for\s+/i, "")
      .replace(/\sobserved$/i, "")
      .replace(/\sholiday$/i, "")
      .trim();

  // Group util events by year-month-baseName
  const utilEventsGrouped = new Map<string, { mainEvents: UtilEvent[]; others: UtilEvent[] }>();

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
      const summaryRaw = e.summary ?? "";
      const summaryLower = summaryRaw.toLowerCase();
      const calIdLower = (cal.id ?? "").toLowerCase();

      const isUtil =
        isAllDay &&
        (summaryLower.includes("birthday") ||
          summaryLower.includes("holiday") ||
          calIdLower.includes("birthday") ||
          calIdLower.includes("holiday"));

      if (!isUtil) {
        // Normal event
        const start = e.start.dateTime ?? (e.start.date as string);
        const end = e.end.dateTime ?? (e.end.date as string);
        const timeZone = e.start.timeZone ?? cal.timeZone ?? "UTC";

        const calendarBg =
          calendarColors[cal.colorId as keyof typeof calendarColors]?.background ??
          cal.backgroundColor ??
          "#9a9cff";

        const eventBg =
          e.colorId && eventColors[e.colorId]?.background
            ? eventColors[e.colorId].background
            : calendarBg;

        allEvents.push({
          id: e.id as string,
          calendarId: cal.id as string,
          summary: e.summary ?? "",
          description: e.description,
          color: calendarBg,
          bgColor: eventBg,
          organizer: e.organizer?.displayName
            ? { displayName: e.organizer.displayName }
            : undefined,
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

        continue;
      }

      // Util event logic here

      const start = e.start.dateTime ?? (e.start.date as string);
      const timeZone = e.start.timeZone ?? cal.timeZone ?? "UTC";

      // Base name normalized
      const baseName = normalizeHolidayBase(summaryRaw);

      // Year-month for grouping
      const startDate = new Date(start);
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;

      const key = `${year}-${month}-${baseName}`;

      const calendarBg =
        calendarColors[cal.colorId as keyof typeof calendarColors]?.background ??
        cal.backgroundColor ??
        "#9a9cff";

      const eventBg =
        e.colorId && eventColors[e.colorId]?.background
          ? eventColors[e.colorId].background
          : calendarBg;

      const utilEvent: UtilEvent = {
        id: e.id as string,
        calendarId: cal.id as string,
        summary: e.summary ?? "",
        description: e.description,
        color: calendarBg,
        bgColor: eventBg,
        organizer: e.organizer?.displayName ? { displayName: e.organizer.displayName } : undefined,
        date: { dateTime: start, timeZone }
      };

      if (!utilEventsGrouped.has(key)) {
        utilEventsGrouped.set(key, { mainEvents: [], others: [] });
      }

      // Determine if exact base name or a "duplicate" with day off, observed, etc.
      if (summaryLower === baseName.toLowerCase()) {
        utilEventsGrouped.get(key)?.mainEvents.push(utilEvent);
      } else {
        utilEventsGrouped.get(key)?.others.push(utilEvent);
      }
    }
  }

  // Flatten util events — keep all mainEvents, ignore others if mainEvents exist for that group
  const utilEvents: UtilEvent[] = [];

  for (const { mainEvents, others } of utilEventsGrouped.values()) {
    if (mainEvents.length > 0) {
      utilEvents.push(...mainEvents);
    } else {
      // If no exact main event, keep others (fallback)
      utilEvents.push(...others);
    }
  }

  // Sort events descending by start date
  const sortedEvents = allEvents.sort((a, b) => {
    const aTime = new Date(a.start.dateTime).getTime();
    const bTime = new Date(b.start.dateTime).getTime();
    return bTime - aTime;
  });

  // Save caches
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
    kv.del(KV_GOOGLE_UTIL_EVENTS(userId)),
    kv.del(KV_GOOGLE_TASKS(userId))
  ]);
}
