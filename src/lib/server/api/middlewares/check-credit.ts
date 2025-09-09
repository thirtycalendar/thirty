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
    await creditService.decrement(user.id);

    return next();
  } catch (err) {
    if (err instanceof Error && err.message === "No credits left") {
      return c.json<ErrorResponse>({ success: false, message: "No credits left." }, 403);
    }

    console.error(`[Credit Error] Failed to decrement credits for user ${user.id}:`, err);
    return c.json<ErrorResponse>({ success: false, message: "Internal server error." }, 500);
  }
});
