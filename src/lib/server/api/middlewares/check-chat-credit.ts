import { startOfMonth } from "date-fns";
import { createMiddleware } from "hono/factory";

import { creditService, maybeGetCreditByUserId } from "$lib/server/services/credit";

import { MessageLimitByPlan } from "$lib/shared/constants";
import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "../context";

export const checkChatCredits = createMiddleware<Context>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    throw new Error("Use `checkChatCredits` after `logged-in` middleware.");
  }

  const today = startOfMonth(new Date());
  const monthStr = today.toDateString();

  const existingCredit = await maybeGetCreditByUserId(user.id);

  const plan = existingCredit?.plan ?? "free";
  const planLimit = plan === "pro" ? MessageLimitByPlan.pro : MessageLimitByPlan.free;

  const isCurrentMonth =
    existingCredit?.month && new Date(existingCredit.month).getTime() === today.getTime();

  // Insert or reset credit if it's a new month or no record exists
  if (!existingCredit || !isCurrentMonth) {
    await creditService.create(user.id, {
      plan,
      count: 1,
      month: monthStr,
      userId: user.id
    });

    return next();
  }

  // Limit check
  if ((existingCredit.count ?? 0) >= planLimit) {
    return c.json<ErrorResponse>({ success: false, message: "Message limit reached." }, 403);
  }

  // Increment count
  await creditService.update(existingCredit.id, {
    count: (existingCredit.count ?? 0) + 1
  });

  return next();
});
