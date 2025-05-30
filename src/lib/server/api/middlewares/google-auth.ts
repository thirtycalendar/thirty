import { createMiddleware } from "hono/factory";

import { auth } from "$lib/server/auth";

import type { ErrorResponse } from "$lib/types";

import type { Context } from "../context";

export const googleAuth = createMiddleware<Context>(async (c, next) => {
  const session = await auth.api.getAccessToken({
    body: { providerId: "google" },
    headers: c.req.raw.headers
  });

  if (!session.accessToken) {
    return c.json<ErrorResponse>({ success: false, message: "Unauthorized" }, 401);
  }

  c.set("accessToken", session.accessToken);

  await next();
});
