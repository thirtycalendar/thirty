import { and, eq } from "drizzle-orm";

import { MessageLimitByPlan } from "$lib/shared/constants";
import type { Credit, SubscriptionPlan } from "$lib/shared/types";

import { db } from "../db";
import { creditTable } from "../db/tables";

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export const creditService = {
  async createInitial(userId: string): Promise<Credit> {
    const month = getCurrentMonth();

    const [row] = await db
      .insert(creditTable)
      .values({
        userId,
        plan: "free",
        count: MessageLimitByPlan.free,
        month
      })
      .returning();

    return row;
  },

  async update(userId: string, { plan }: { plan: SubscriptionPlan }): Promise<Credit> {
    const month = getCurrentMonth();
    const limit = MessageLimitByPlan[plan];

    const [row] = await db
      .insert(creditTable)
      .values({
        userId,
        plan,
        count: limit,
        month
      })
      .onConflictDoUpdate({
        target: [creditTable.userId, creditTable.month],
        set: { plan, count: limit, updatedAt: new Date().toISOString() }
      })
      .returning();

    return row;
  },

  async get(userId: string): Promise<Credit> {
    const month = getCurrentMonth();

    const [row] = await db
      .select()
      .from(creditTable)
      .where(and(eq(creditTable.userId, userId), eq(creditTable.month, month)))
      .limit(1);

    if (row) return row;

    const [newRow] = await db
      .insert(creditTable)
      .values({
        userId,
        plan: "free",
        count: MessageLimitByPlan.free,
        month
      })
      .returning();

    return newRow;
  },

  async decrement(userId: string): Promise<void> {
    const credit = await creditService.get(userId);
    if (credit.count <= 0) throw new Error("No credits left");

    await db
      .update(creditTable)
      .set({ count: credit.count - 1, updatedAt: new Date().toISOString() })
      .where(eq(creditTable.id, credit.id));
  }
};
