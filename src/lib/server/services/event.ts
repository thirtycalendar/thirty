import { eq, sql } from "drizzle-orm";

import { KV_EVENTS } from "$lib/shared/utils/kv-keys";
import type { Event, EventForm } from "$lib/shared/types";

import { db } from "../db";
import { eventTable } from "../db/tables/event";
import { kv } from "../libs/upstash/kv";

export async function cacheEvents(userId: string, list: Event[]) {
  await kv.set(KV_EVENTS(userId), list, { ex: 900 });
}

export async function refreshEventsFromDb(userId: string) {
  const list = await db.select().from(eventTable).where(eq(eventTable.userId, userId));

  await cacheEvents(userId, list);
  return list;
}

export async function getAllEvents(userId: string): Promise<Event[]> {
  const cached = await kv.get<Event[]>(KV_EVENTS(userId));
  if (cached) return cached;

  return await refreshEventsFromDb(userId);
}

export async function getEvent(eventId: string): Promise<Event> {
  const [event] = await db.select().from(eventTable).where(eq(eventTable.id, eventId)).limit(1);

  if (!event) throw new Error("No event with id found");

  return event;
}

export async function createEvent(userId: string, eventForm: EventForm): Promise<Event> {
  const [inserted] = await db
    .insert(eventTable)
    .values({ userId, ...eventForm })
    .returning();

  if (!inserted) throw new Error("Failed to create event");

  const cached = await kv.get<Event[]>(KV_EVENTS(userId));

  if (cached) {
    cached.push(inserted);

    await cacheEvents(userId, cached);
  } else {
    await refreshEventsFromDb(userId);
  }

  return inserted;
}

export async function updateEvent(eventId: string, updates: Partial<EventForm>): Promise<Event> {
  const [updated] = await db
    .update(eventTable)
    .set({ ...updates, updatedAt: sql`now()` })
    .where(eq(eventTable.id, eventId))
    .returning();

  if (!updated) throw new Error("Failed to update event");

  const userId = updated.userId;
  const cached = await kv.get<Event[]>(KV_EVENTS(userId));

  if (cached) {
    const index = cached.findIndex((c) => c.id === eventId);
    if (index !== -1) {
      cached[index] = updated;

      await cacheEvents(userId, cached);
    }
  } else {
    await refreshEventsFromDb(userId);
  }

  return updated;
}

export async function deleteEvent(eventId: string): Promise<Event> {
  const [deleted] = await db.delete(eventTable).where(eq(eventTable.id, eventId)).returning();

  if (!deleted) throw new Error("Failed to delete event");

  const userId = deleted.userId;
  const cached = await kv.get<Event[]>(KV_EVENTS(userId));

  if (cached) {
    const updated = cached.filter((c) => c.id !== eventId);

    await cacheEvents(userId, updated);
  } else {
    await refreshEventsFromDb(userId);
  }

  return deleted;
}

export async function clearEvents(userId: string) {
  await kv.del(KV_EVENTS(userId));
}

export async function createEventsBulk(userId: string, data: EventForm[]) {
  if (data.length === 0) return;
  await db.insert(eventTable).values(data.map((e) => ({ ...e, userId })));
}
