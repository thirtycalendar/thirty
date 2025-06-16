import { eq, sql } from "drizzle-orm";

import type { Event, EventForm } from "$lib/types";
import { KV_EVENTS } from "$lib/utils/kv-keys";

import { db } from "../db";
import { events } from "../db/schemas/event-table";
import { kv } from "../utils/upstash/kv";

async function cacheEvents(userId: string, list: Event[]) {
  await kv.set(KV_EVENTS(userId), list, { ex: 3600 });
}

async function refreshEventsFromDb(userId: string) {
  const list = await db.select().from(events).where(eq(events.userId, userId));

  await cacheEvents(userId, list);
  return list;
}

export async function getAllEvents(userId: string): Promise<Event[]> {
  const cached = await kv.get<Event[]>(KV_EVENTS(userId));
  if (cached) return cached;

  return await refreshEventsFromDb(userId);
}

export async function getEvent(eventId: string): Promise<Event> {
  const [event] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

  if (!event) throw new Error("No event with id found");

  return event;
}

export async function createEvent(userId: string, eventForm: EventForm): Promise<Event> {
  const [inserted] = await db
    .insert(events)
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
    .update(events)
    .set({ ...updates, updatedAt: sql`now()` })
    .where(eq(events.id, eventId))
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
  const [deleted] = await db.delete(events).where(eq(events.id, eventId)).returning();

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
