import { Hono } from "hono";

import { streamChat } from "$lib/server/chat";

import type { User } from "$lib/shared/types";

import { loggedIn } from "../middlewares/logged-in";
import { errorResponse } from "../utils";

const app = new Hono().use(loggedIn).post("/", async (c) => {
  try {
    const user = c.get("user") as User;
    const { messages } = await c.req.json();

    return streamChat(user.id, messages);
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});

export default app;
