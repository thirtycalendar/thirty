import type { calendar_v3 } from "@googleapis/calendar";
import type { tasks_v1 } from "@googleapis/tasks";

import { kv } from "$lib/server/utils/upstash/kv";

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
  await kv.set<calendar_v3.Schema$CalendarListEntry[]>(`google:${userId}:calendars`, calendars);

  // 2. Events from all calendars
  const allEvents: calendar_v3.Schema$Event[] = [];
  for (const cal of calendars) {
    const res = await calendar.events.list({
      calendarId: cal.id as string,
      maxResults: 2500,
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime"
    });

    const events = res.data.items ?? [];
    allEvents.push(...events);
  }
  await kv.set<calendar_v3.Schema$Event[]>(`google:${userId}:events`, allEvents);

  // 3. Tasks from all task lists
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
  await kv.set<tasks_v1.Schema$Task[]>(`google:${userId}:tasks`, allTasks);

  return {
    calendars,
    events: allEvents,
    tasks: allTasks
  };
}
