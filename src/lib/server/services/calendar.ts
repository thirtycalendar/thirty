import { and, eq, ne, sql } from "drizzle-orm";

import { KV_CALENDARS } from "$lib/shared/utils/kv-keys";
import type { Calendar, CalendarForm } from "$lib/types";

import { db } from "../db";
import { calendars } from "../db/tables/calendar";
import { kv } from "../libs/upstash/kv";
import { refreshEventsFromDb } from "./event";

export async function cacheCalendars(userId: string, list: Calendar[]) {
  await kv.set(KV_CALENDARS(userId), list, { ex: 3600 });
}

export async function refreshCalendarsFromDb(userId: string) {
  const list = await db.select().from(calendars).where(eq(calendars.userId, userId));

  await cacheCalendars(userId, list);
  return list;
}

export async function getAllCalendars(userId: string): Promise<Calendar[]> {
  const cached = await kv.get<Calendar[]>(KV_CALENDARS(userId));
  if (cached) return cached;

  return await refreshCalendarsFromDb(userId);
}

export async function getCalendar(calendarId: string): Promise<Calendar> {
  const [calendar] = await db.select().from(calendars).where(eq(calendars.id, calendarId)).limit(1);

  if (!calendar) throw new Error("No calendar with id found");

  return calendar;
}

export async function createCalendar(
  userId: string,
  calendarForm: CalendarForm
): Promise<Calendar> {
  if (calendarForm.isPrimary) {
    await db
      .update(calendars)
      .set({ isPrimary: false, updatedAt: sql`now()` })
      .where(and(eq(calendars.userId, userId), eq(calendars.isPrimary, true)));
  }

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

export async function updateCalendar(
  calendarId: string,
  updates: Partial<CalendarForm>
): Promise<Calendar> {
  const [existing] = await db.select().from(calendars).where(eq(calendars.id, calendarId)).limit(1);

  if (!existing) throw new Error("Calendar not found");

  if (updates.isPrimary) {
    await db
      .update(calendars)
      .set({ isPrimary: false, updatedAt: sql`now()` })
      .where(
        and(
          eq(calendars.userId, existing.userId),
          eq(calendars.isPrimary, true),
          ne(calendars.id, calendarId)
        )
      );
  }

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

export async function deleteCalendar(calendarId: string): Promise<Calendar> {
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

  await refreshEventsFromDb(userId);

  return deleted;
}

export async function createCalendarsBulk(userId: string, data: CalendarForm[]) {
  if (data.length === 0) return;
  await db.insert(calendars).values(data.map((c) => ({ ...c, userId })));
}
