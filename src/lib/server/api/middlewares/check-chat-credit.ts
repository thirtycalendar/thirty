import { format, startOfMonth } from "date-fns";
import { createMiddleware } from "hono/factory";

import { creditService, maybeGetCreditByUserId } from "$lib/server/services";
import { auth } from "$lib/server/auth";

import { polarProductIdsEnvConfig } from "$lib/shared/utils/env-config";
import { MessageLimitByPlan } from "$lib/shared/constants";
import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "../context";

export const checkChatCredits = createMiddleware<Context>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    throw new Error("Use `checkChatCredits` after `logged-in` middleware.");
  }

  const today = new Date();
  const month = startOfMonth(today);

  const subscriptions = await auth.api.subscriptions({
    query: { page: 1, limit: 1, active: true }
  });
  const sub = subscriptions.result.items[0];

  const plan = sub?.productId === polarProductIdsEnvConfig.pro ? "pro" : "free";
  const planLimit = plan === "pro" ? MessageLimitByPlan.pro : MessageLimitByPlan.free;

  const existingCredit = await maybeGetCreditByUserId(user.id);

  const isCurrentMonth =
    existingCredit && format(existingCredit.month, "yyyy-MM") === format(today, "yyyy-MM");

  if (!existingCredit || !isCurrentMonth) {
    await creditService.create(user.id, {
      plan,
      count: 1,
      month,
      userId: user.id
    });

    return next();
  }

  if ((existingCredit.count ?? 0) >= planLimit) {
    return c.json<ErrorResponse>({ success: false, message: "Message limit reached." }, 403);
  }

  await creditService.update(existingCredit.id, {
    count: (existingCredit.count ?? 0) + 1
  });

  return next();
});
