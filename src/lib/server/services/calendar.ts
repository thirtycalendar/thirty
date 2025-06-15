import { eq, sql } from "drizzle-orm";

import type { Calendar, CalendarForm } from "$lib/types";
import { KV_CALENDARS } from "$lib/utils/kv-keys";

import { db } from "../db";
import { calendars } from "../db/schemas/calendar-table";
import { kv } from "../utils/upstash/kv";

async function cacheCalendars(userId: string, list: Calendar[]) {
  await kv.set(KV_CALENDARS(userId), list, { ex: 3600 });
}

async function refreshCalendarsFromDb(userId: string) {
  const list = await db.select().from(calendars).where(eq(calendars.userId, userId));
  await cacheCalendars(userId, list);
  return list;
}

export async function getAllCalendars(userId: string): Promise<Calendar[]> {
  const cached = await kv.get<Calendar[]>(KV_CALENDARS(userId));
  if (cached) return cached;
  return await refreshCalendarsFromDb(userId);
}

export async function getCalendar(calendarId: string): Promise<Calendar | undefined> {
  const [calendar] = await db.select().from(calendars).where(eq(calendars.id, calendarId)).limit(1);
  return calendar;
}

export async function createCalendar(
  userId: string,
  calendarForm: CalendarForm
): Promise<Calendar> {
  const [inserted] = await db
    .insert(calendars)
    .values({ userId, ...calendarForm })
    .returning();

  if (!inserted) throw new Error("Failed to create calendar");

  const cached = await kv.get<Calendar[]>(KV_CALENDARS(userId));

  if (cached) {
    cached.push(inserted);

    await cacheCalendars(userId, cached);
  } else {
    await refreshCalendarsFromDb(userId);
  }

  return inserted;
}

export async function updateCalendar(calendarId: string, updates: CalendarForm): Promise<Calendar> {
  const [updated] = await db
    .update(calendars)
    .set({ ...updates, updatedAt: sql`now()` })
    .where(eq(calendars.id, calendarId))
    .returning();

  if (!updated) throw new Error("Failed to update calendar");

  const userId = updated.userId;
  const cached = await kv.get<Calendar[]>(KV_CALENDARS(userId));

  if (cached) {
    const index = cached.findIndex((c) => c.id === calendarId);
    if (index !== -1) {
      cached[index] = updated;

      await cacheCalendars(userId, cached);
    }
  } else {
    await refreshCalendarsFromDb(userId);
  }

  return updated;
}

export async function deleteCalendar(calendarId: string): Promise<string> {
  const [deleted] = await db.delete(calendars).where(eq(calendars.id, calendarId)).returning();

  if (!deleted) throw new Error("Failed to delete calendar");

  const userId = deleted.userId;
  const cached = await kv.get<Calendar[]>(KV_CALENDARS(userId));

  if (cached) {
    const updated = cached.filter((c) => c.id !== calendarId);

    await cacheCalendars(userId, updated);
  } else {
    await refreshCalendarsFromDb(userId);
  }

  return `${deleted.name} deleted`;
}
