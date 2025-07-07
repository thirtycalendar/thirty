import { eq, sql } from "drizzle-orm";

import { KV_BIRTHDAYS } from "$lib/shared/utils/kv-keys";
import type { Birthday, BirthdayForm } from "$lib/shared/types";

import { db } from "../db";
import { birthdayTable } from "../db/tables/birthday";
import { kv } from "../libs/upstash/kv";

export async function cacheBirthdays(userId: string, list: Birthday[]) {
  await kv.set(KV_BIRTHDAYS(userId), list, { ex: 86000 });
}

export async function refreshBirthdaysFromDb(userId: string) {
  const list = await db.select().from(birthdayTable).where(eq(birthdayTable.userId, userId));

  await cacheBirthdays(userId, list);
  return list;
}

export async function getAllBirthdays(userId: string): Promise<Birthday[]> {
  const cached = await kv.get<Birthday[]>(KV_BIRTHDAYS(userId));
  if (cached) return cached;

  return await refreshBirthdaysFromDb(userId);
}

export async function getBirthday(birthdayId: string): Promise<Birthday> {
  const [birthday] = await db
    .select()
    .from(birthdayTable)
    .where(eq(birthdayTable.id, birthdayId))
    .limit(1);

  if (!birthday) throw new Error("No birthday with id found");

  return birthday;
}

export async function createBirthday(
  userId: string,
  birthdayForm: BirthdayForm
): Promise<Birthday> {
  const [inserted] = await db
    .insert(birthdayTable)
    .values({ userId, ...birthdayForm })
    .returning();

  if (!inserted) throw new Error("Failed to create birthday");

  const cached = await kv.get<Birthday[]>(KV_BIRTHDAYS(userId));

  if (cached) {
    cached.push(inserted);
    await cacheBirthdays(userId, cached);
  } else {
    await refreshBirthdaysFromDb(userId);
  }

  return inserted;
}

export async function updateBirthday(
  birthdayId: string,
  updates: Partial<BirthdayForm>
): Promise<Birthday> {
  const [updated] = await db
    .update(birthdayTable)
    .set({ ...updates, updatedAt: sql`now()` })
    .where(eq(birthdayTable.id, birthdayId))
    .returning();

  if (!updated) throw new Error("Failed to update birthday");

  const userId = updated.userId;
  const cached = await kv.get<Birthday[]>(KV_BIRTHDAYS(userId));

  if (cached) {
    const index = cached.findIndex((c) => c.id === birthdayId);
    if (index !== -1) {
      cached[index] = updated;
      await cacheBirthdays(userId, cached);
    }
  } else {
    await refreshBirthdaysFromDb(userId);
  }

  return updated;
}

export async function deleteBirthday(birthdayId: string): Promise<Birthday> {
  const [deleted] = await db
    .delete(birthdayTable)
    .where(eq(birthdayTable.id, birthdayId))
    .returning();

  if (!deleted) throw new Error("Failed to delete birthday");

  const userId = deleted.userId;
  const cached = await kv.get<Birthday[]>(KV_BIRTHDAYS(userId));

  if (cached) {
    const updated = cached.filter((c) => c.id !== birthdayId);
    await cacheBirthdays(userId, updated);
  } else {
    await refreshBirthdaysFromDb(userId);
  }

  return deleted;
}

export async function createBirthdaysBulk(userId: string, data: BirthdayForm[]) {
  if (data.length === 0) return;
  await db.insert(birthdayTable).values(data.map((b) => ({ ...b, userId })));
}

export async function clearBirthdays(userId: string) {
  await kv.del(KV_BIRTHDAYS(userId));
}
