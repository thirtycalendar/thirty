import { Hono } from "hono";

import { auth } from "$lib/server/auth";

const app = new Hono();

app.on(["POST", "GET"], "/**", (c) => auth.handler(c.req.raw));

export default app;
