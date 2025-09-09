import { and, eq, sql } from "drizzle-orm";

import { MessageLimitByPlan } from "$lib/shared/constants";
import type { Credit, SubscriptionPlan } from "$lib/shared/types";

import { db } from "../db";
import { creditTable } from "../db/tables";

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export const creditService = {
  async get(userId: string): Promise<Credit> {
    const month = getCurrentMonth();

    const [existingRow] = await db
      .select()
      .from(creditTable)
      .where(and(eq(creditTable.userId, userId), eq(creditTable.month, month)))
      .limit(1);

    if (existingRow) return existingRow;

    const plan = "free";
    const remaining = MessageLimitByPlan[plan];

    const [newRow] = await db
      .insert(creditTable)
      .values({ userId, plan, remaining, month })
      .returning();

    if (!newRow) {
      throw new Error("Failed to create user credit");
    }

    return newRow;
  },

  async decrement(userId: string): Promise<Credit> {
    const month = getCurrentMonth();

    const [updatedRow] = await db
      .update(creditTable)
      .set({
        remaining: sql`${creditTable.remaining} - 1`,
        updatedAt: new Date().toISOString()
      })
      .where(and(eq(creditTable.userId, userId), eq(creditTable.month, month)))
      .returning();

    if (!updatedRow) {
      throw new Error("Credit entry not found or update failed.");
    }

    if (updatedRow.remaining < 0) {
      await db
        .update(creditTable)
        .set({
          remaining: 0
        })
        .where(eq(creditTable.id, updatedRow.id));
      throw new Error("No credits left");
    }

    return updatedRow;
  },

  async update(userId: string, plan: SubscriptionPlan): Promise<Credit> {
    const month = getCurrentMonth();
    const limit = MessageLimitByPlan[plan];

    const [row] = await db
      .update(creditTable)
      .set({ plan, remaining: limit, updatedAt: new Date().toISOString() })
      .where(and(eq(creditTable.userId, userId), eq(creditTable.month, month)))
      .returning();

    if (row) {
      return row;
    }

    const [newRow] = await db
      .insert(creditTable)
      .values({ userId, plan, remaining: limit, month })
      .returning();

    return newRow;
  }
};
