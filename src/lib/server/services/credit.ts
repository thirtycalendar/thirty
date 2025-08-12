import { desc, eq } from "drizzle-orm";

import type { Credit, CreditForm } from "$lib/shared/types";

import { db } from "../db";
import { creditTable } from "../db/tables/credit";
import { createDbService } from "../utils/create-db-service";

export const creditService = createDbService<Credit, CreditForm>(db, {
  table: creditTable
});

export async function getCreditByUserId(userId: string): Promise<Credit> {
  const [row] = await db
    .select()
    .from(creditTable)
    .where(eq(creditTable.userId, userId))
    .orderBy(desc(creditTable.month))
    .limit(1);

  if (!row) throw new Error(`User ID (${userId}) credit not found`);

  return row;
}

export async function maybeGetCreditByUserId(userId: string): Promise<Credit | null> {
  const [row] = await db
    .select()
    .from(creditTable)
    .where(eq(creditTable.userId, userId))
    .orderBy(desc(creditTable.month))
    .limit(1);

  return row ?? null;
}
