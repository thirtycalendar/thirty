import { createMiddleware } from "hono/factory";

import { creditService } from "$lib/server/services";

import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "../context";

export const checkCredit = createMiddleware<Context>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    throw new Error("`checkCredit` must be used after `logged-in` middleware.");
  }

  try {
    const credit = await creditService.get(user.id);

    if (credit.count <= 0) {
      return c.json<ErrorResponse>(
        { success: false, message: "You have no credits left for this month." },
        402
      );
    }

    await creditService.decrement(user.id);

    return next();
  } catch (err) {
    console.log(`[Credit Error] Failed to check/update credits for user ${user.id}:`, err);

    return next();
  }
});
