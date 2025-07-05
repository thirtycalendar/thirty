import { eq, sql } from "drizzle-orm";

import { KV_EVENTS } from "$lib/shared/utils/kv-keys";
import type { Task, TaskForm } from "$lib/types";

import { db } from "../db";
import { tasks } from "../db/tables/task";
import { kv } from "../libs/upstash/kv";

async function cacheTasks(userId: string, list: Task[]) {
  await kv.set(KV_EVENTS(userId), list, { ex: 1800 });
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

export async function getTask(taskId: string): Promise<Task> {
  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);

  if (!task) throw new Error("No task with id found");

  return task;
}

export async function createTask(userId: string, taskForm: TaskForm): Promise<Task> {
  const [inserted] = await db
    .insert(tasks)
    .values({ userId, ...taskForm })
    .returning();

  if (!inserted) throw new Error("Failed to create task");

  const cached = await kv.get<Task[]>(KV_EVENTS(userId));

  if (cached) {
    cached.push(inserted);

    await cacheTasks(userId, cached);
  } else {
    await refreshTasksFromDb(userId);
  }

  return inserted;
}

export async function updateTask(taskId: string, updates: TaskForm): Promise<Task> {
  const [updated] = await db
    .update(tasks)
    .set({ ...updates, updatedAt: sql`now()` })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updated) throw new Error("Failed to update task");

  const userId = updated.userId;
  const cached = await kv.get<Task[]>(KV_EVENTS(userId));

  if (cached) {
    const index = cached.findIndex((c) => c.id === taskId);
    if (index !== -1) {
      cached[index] = updated;

      await cacheTasks(userId, cached);
    }
  } else {
    await refreshTasksFromDb(userId);
  }

  return updated;
}

export async function deleteTask(taskId: string): Promise<Task> {
  const [deleted] = await db.delete(tasks).where(eq(tasks.id, taskId)).returning();

  if (!deleted) throw new Error("Failed to delete task");

  const userId = deleted.userId;
  const cached = await kv.get<Task[]>(KV_EVENTS(userId));

  if (cached) {
    const updated = cached.filter((c) => c.id !== taskId);

    await cacheTasks(userId, updated);
  } else {
    await refreshTasksFromDb(userId);
  }

  return deleted;
}
