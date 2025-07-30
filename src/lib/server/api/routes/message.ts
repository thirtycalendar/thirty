import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { db } from "$lib/server/db";
import { messageTable } from "$lib/server/db/tables/message";

import type { Message, SuccessResponse } from "$lib/shared/types";

import { loggedIn } from "../middlewares/logged-in";
import { errorResponse, requireParam } from "../utils";

const app = new Hono().use(loggedIn).get("/getAll/:chatId", async (c) => {
  try {
    const id = c.req.param("chatId");
    if (!id) return requireParam(c, "chat id");

    console.log("route chat id:", id);

    const messages = await db.select().from(messageTable).where(eq(messageTable.chatId, id));

    console.log("route messages:", messages);

    return c.json<SuccessResponse<Message[]>>({
      success: true,
      message: "Success",
      data: messages
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});

export default app;
