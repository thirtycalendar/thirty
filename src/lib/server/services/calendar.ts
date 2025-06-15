import { eq } from "drizzle-orm";

import type { Calendar } from "$lib/types";
import { KV_CALENDARS } from "$lib/utils/kv-keys";

import { db } from "../db";
import { calendars } from "../db/schemas/calendar-table";
import { kv } from "../utils/upstash/kv";

export async function cacheCalendars(userId: string, calendarList: Calendar[]) {
  kv.set(KV_CALENDARS(userId), calendarList, { ex: 3600 });
}

export async function getAllCalendars(userId: string): Promise<Calendar[]> {
  const cached = await kv.get<Calendar[]>(KV_CALENDARS(userId));
  if (cached) {
    return cached;
  }

  const calendarList = await db.select().from(calendars).where(eq(calendars.userId, userId));
  await cacheCalendars(userId, calendarList);

  return calendarList;
}

export async function getCalendar(calendarId: string): Promise<Calendar> {
  const calendarList = await db
    .select()
    .from(calendars)
    .where(eq(calendars.id, calendarId))
    .limit(1);

  return calendarList[0];
}
