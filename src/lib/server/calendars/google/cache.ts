import type { calendar_v3 } from "@googleapis/calendar";
import type { tasks_v1 } from "@googleapis/tasks";

import { kv } from "$lib/server/utils/upstash/kv";

import { KV_GOOGLE_CALENDARS, KV_GOOGLE_EVENTS, KV_GOOGLE_TASKS } from "$lib/utils/kv-keys";

import { getGoogleClients } from "./client";

export interface CachedGoogleData {
  calendars: calendar_v3.Schema$CalendarListEntry[];
  events: calendar_v3.Schema$Event[];
  tasks: tasks_v1.Schema$Task[];
}

export async function fetchAndCacheAllGoogleCalData(userId: string): Promise<CachedGoogleData> {
  const { calendar, tasks } = await getGoogleClients(userId);

  // 1. Calendars
  const calendarsRes = await calendar.calendarList.list();
  const calendars = calendarsRes.data.items ?? [];

  await kv.set(KV_GOOGLE_CALENDARS(userId), calendars);

  // 2. Events
  const allEvents: calendar_v3.Schema$Event[] = [];

  for (const cal of calendars) {
    const res = await calendar.events.list({
      calendarId: cal.id as string,
      maxResults: 2500,
      singleEvents: true,
      showDeleted: false,
      orderBy: "startTime"
    });

    const events = res.data.items ?? [];
    allEvents.push(...events);
  }

  const sortedEvents = allEvents
    .filter((e) => e.start?.dateTime || e.start?.date) // only valid events
    .sort((a, b) => {
      const aTime = new Date(a.created ?? a.start?.dateTime ?? (a.start?.date as string)).getTime();
      const bTime = new Date(b.created ?? b.start?.dateTime ?? (b.start?.date as string)).getTime();
      return bTime - aTime; // newest first
    });

  await kv.set(KV_GOOGLE_EVENTS(userId), sortedEvents);

  // 3. Tasks
  const taskListsRes = await tasks.tasklists.list();
  const taskLists = taskListsRes.data.items ?? [];
  const allTasks: tasks_v1.Schema$Task[] = [];

  for (const list of taskLists) {
    const res = await tasks.tasks.list({
      tasklist: list.id as string,
      maxResults: 100
    });
    const tasksInList = res.data.items ?? [];
    allTasks.push(...tasksInList);
  }

  await kv.set(KV_GOOGLE_TASKS(userId), allTasks);

  return {
    calendars,
    events: sortedEvents,
    tasks: allTasks
  };
}
