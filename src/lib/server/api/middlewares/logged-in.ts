import { createMiddleware } from "hono/factory";

import { auth } from "$lib/server/auth";

import type { ErrorResponse } from "$lib/shared/types";

import type { Context } from "../context";

export const loggedIn = createMiddleware<Context>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json<ErrorResponse>({ success: false, message: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});
