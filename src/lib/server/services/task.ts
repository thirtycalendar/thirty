import { eq, sql } from "drizzle-orm";

import type { Task, TaskForm } from "$lib/types";
import { KV_EVENTS } from "$lib/utils/kv-keys";

import { db } from "../db";
import { tasks } from "../db/schemas/task-table";
import { kv } from "../utils/upstash/kv";

async function cacheTasks(userId: string, list: Task[]) {
  await kv.set(KV_EVENTS(userId), list, { ex: 3600 });
}

async function refreshTasksFromDb(userId: string) {
  const list = await db.select().from(tasks).where(eq(tasks.userId, userId));

  await cacheTasks(userId, list);
  return list;
}

export async function getAllTasks(userId: string): Promise<Task[]> {
  const cached = await kv.get<Task[]>(KV_EVENTS(userId));
  if (cached) return cached;

  return await refreshTasksFromDb(userId);
}

export async function getTask(calendarId: string): Promise<Task | undefined> {
  const [calendar] = await db.select().from(tasks).where(eq(tasks.id, calendarId)).limit(1);

  return calendar;
}

export async function createTask(userId: string, calendarForm: TaskForm): Promise<Task> {
  const [inserted] = await db
    .insert(tasks)
    .values({ userId, ...calendarForm })
    .returning();

  if (!inserted) throw new Error("Failed to create calendar");

  const cached = await kv.get<Task[]>(KV_EVENTS(userId));

  if (cached) {
    cached.push(inserted);

    await cacheTasks(userId, cached);
  } else {
    await refreshTasksFromDb(userId);
  }

  return inserted;
}

export async function updateTask(calendarId: string, updates: TaskForm): Promise<Task> {
  const [updated] = await db
    .update(tasks)
    .set({ ...updates, updatedAt: sql`now()` })
    .where(eq(tasks.id, calendarId))
    .returning();

  if (!updated) throw new Error("Failed to update calendar");

  const userId = updated.userId;
  const cached = await kv.get<Task[]>(KV_EVENTS(userId));

  if (cached) {
    const index = cached.findIndex((c) => c.id === calendarId);
    if (index !== -1) {
      cached[index] = updated;

      await cacheTasks(userId, cached);
    }
  } else {
    await refreshTasksFromDb(userId);
  }

  return updated;
}

export async function deleteTask(calendarId: string): Promise<string> {
  const [deleted] = await db.delete(tasks).where(eq(tasks.id, calendarId)).returning();

  if (!deleted) throw new Error("Failed to delete calendar");

  const userId = deleted.userId;
  const cached = await kv.get<Task[]>(KV_EVENTS(userId));

  if (cached) {
    const updated = cached.filter((c) => c.id !== calendarId);

    await cacheTasks(userId, updated);
  } else {
    await refreshTasksFromDb(userId);
  }

  return `${deleted.name} deleted`;
}
