import { eq } from "drizzle-orm";

import type { Credit, CreditForm } from "$lib/shared/types";

import { db } from "../db";
import { creditTable } from "../db/tables/credit";
import { createDbService } from "../utils/create-db-service";

export const creditService = createDbService<Credit, CreditForm>(db, {
  table: creditTable
});

export async function maybeGetCreditByUserId(userId: string): Promise<Credit | null> {
  const [row] = await db.select().from(creditTable).where(eq(creditTable.userId, userId)).limit(1);
  return row ?? null;
}
