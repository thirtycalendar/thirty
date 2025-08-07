import { startOfMonth } from "date-fns";
import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";

import { db } from "$lib/server/db";
import { creditTable } from "$lib/server/db/tables/credit";

import { MessageLimitByPlan } from "$lib/shared/constants";
import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "../context";

export const checkChatCredits = createMiddleware<Context>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    throw new Error("Use `checkChatCredits` after `logged-in` middleware.");
  }

  const today = startOfMonth(new Date());

  const [row] = await db.select().from(creditTable).where(eq(creditTable.userId, user.id)).limit(1);

  const plan = row?.plan ?? "free";
  const planLimit = plan === "pro" ? MessageLimitByPlan.pro : MessageLimitByPlan.free;

  const isCurrentMonth = row?.month && new Date(row.month).getTime() === today.getTime();

  if (!row || !isCurrentMonth) {
    await db
      .insert(creditTable)
      .values({
        userId: user.id,
        plan,
        count: 1,
        month: today.toDateString()
      })
      .onConflictDoUpdate({
        target: creditTable.userId,
        set: { count: 1, month: today.toISOString() }
      });

    return next();
  }

  if (row.count! >= planLimit) {
    return c.json<ErrorResponse>({ success: false, message: "Message limit reached." }, 403);
  }

  await db
    .update(creditTable)
    .set({ count: row.count! + 1 })
    .where(eq(creditTable.userId, user.id));

  return next();
});
