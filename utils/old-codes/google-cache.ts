import type { calendar_v3 } from "@googleapis/calendar";

import { kv } from "$lib/server/utils/upstash/kv";

import {
  KV_GOOGLE_CALENDARS,
  KV_GOOGLE_COLORS,
  KV_GOOGLE_EVENTS,
  KV_GOOGLE_TASKS,
  KV_GOOGLE_UTIL_EVENTS
} from "$lib/shared/utils/kv-keys";
import type { Calendar, Color, ColorMap, Event, Task, UtilEvent } from "$lib/types";

import { getGoogleClients } from "./client";

export interface CachedData {
  colors: Color;
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
  function normalizeColors(input: Record<string, calendar_v3.Schema$ColorDefinition>): ColorMap {
    const output: ColorMap = {};
    for (const [id, def] of Object.entries(input)) {
      if (def.background && def.foreground) {
        output[id] = {
          background: def.background,
          foreground: def.foreground
        };
      }
    }
    return output;
  }

  const colorsRes = await calendar.colors.get();
  const calendarColors = normalizeColors(colorsRes.data.calendar ?? {});
  const eventColors = normalizeColors(colorsRes.data.event ?? {});

  const colors = {
    calendar: calendarColors,
    event: eventColors
  };

  // 3. Normalize calendars
  const calendars: Calendar[] = calendarsRaw.map((cal) => ({
    id: cal.id as string,
    summary: cal.summary ?? "",
    timeZone: cal.timeZone ?? "UTC",
    colorId: cal.colorId ?? "",
    accessRole: (cal.accessRole as "owner" | "reader") ?? "reader"
  }));

  await kv.set(KV_GOOGLE_CALENDARS(userId), calendars, { ex: 3600 });

  // 4. Events + Util Events
  const allEvents: Event[] = [];

  const normalizeHolidayBase = (s: string) =>
    s
      .toLowerCase()
      .replace(/^day off for\s+/i, "")
      .replace(/^substitute for\s+/i, "")
      .replace(/\sobserved$/i, "")
      .replace(/\sholiday$/i, "")
      .trim();

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
        const start = e.start.dateTime ?? (e.start.date as string);
        const end = e.end.dateTime ?? (e.end.date as string);
        const timeZone = e.start.timeZone ?? cal.timeZone ?? "UTC";

        allEvents.push({
          id: e.id as string,
          calendarId: cal.id as string,
          summary: e.summary ?? "",
          description: e.description,
          colorId: e.colorId ?? null,
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

      const start = e.start.dateTime ?? (e.start.date as string);
      const timeZone = e.start.timeZone ?? cal.timeZone ?? "UTC";

      const baseName = normalizeHolidayBase(summaryRaw);
      const startDate = new Date(start);
      const key = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${baseName}`;

      const utilEvent: UtilEvent = {
        id: e.id as string,
        calendarId: cal.id as string,
        summary: e.summary ?? "",
        description: e.description,
        colorId: e.colorId ?? null,
        organizer: e.organizer?.displayName ? { displayName: e.organizer.displayName } : undefined,
        date: { dateTime: start, timeZone }
      };

      if (!utilEventsGrouped.has(key)) {
        utilEventsGrouped.set(key, { mainEvents: [], others: [] });
      }

      if (summaryLower === baseName.toLowerCase()) {
        utilEventsGrouped.get(key)?.mainEvents.push(utilEvent);
      } else {
        utilEventsGrouped.get(key)?.others.push(utilEvent);
      }
    }
  }

  const utilEvents: UtilEvent[] = [];

  for (const { mainEvents, others } of utilEventsGrouped.values()) {
    if (mainEvents.length > 0) {
      utilEvents.push(...mainEvents);
    } else {
      utilEvents.push(...others);
    }
  }

  const sortedEvents = allEvents.sort((a, b) => {
    return new Date(b.start.dateTime).getTime() - new Date(a.start.dateTime).getTime();
  });

  await Promise.all([
    kv.set(KV_GOOGLE_EVENTS(userId), sortedEvents, { ex: 900 }),
    kv.set(KV_GOOGLE_UTIL_EVENTS(userId), utilEvents, { ex: 3600 }),
    kv.set(KV_GOOGLE_COLORS(userId), colors, { ex: 3600 })
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
    utilEvents,
    colors
  };
}

export async function deleteGoogleCalDataCache(userId: string) {
  await Promise.all([
    kv.del(KV_GOOGLE_CALENDARS(userId)),
    kv.del(KV_GOOGLE_EVENTS(userId)),
    kv.del(KV_GOOGLE_UTIL_EVENTS(userId)),
    kv.del(KV_GOOGLE_TASKS(userId)),
    kv.del(KV_GOOGLE_COLORS(userId))
  ]);
}
