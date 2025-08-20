import { Hono } from "hono";

import { auth } from "$lib/server/auth";

export const authRoute = new Hono();

authRoute.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});
