import { zValidator } from "@hono/zod-validator";

import { eq } from "drizzle-orm";
import { Hono } from "hono";

import { chatService } from "$lib/server/services/chat";
import { db } from "$lib/server/db";
import { messageTable } from "$lib/server/db/tables/message";
import { streamChat } from "$lib/server/chat";

import { chatSchema } from "$lib/shared/schemas/chat";
import type { Chat, Message, SuccessResponse, User } from "$lib/shared/types";

import { loggedIn } from "../middlewares/logged-in";
import { errorResponse, requireParam } from "../utils";

const app = new Hono()
  .use(loggedIn)
  .post("/", async (c) => {
    try {
      const user = c.get("user") as User;
      const { messages, chatId } = await c.req.json();

      return streamChat(user.id, chatId, messages);
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/message/getAll/:chatId", async (c) => {
    try {
      const id = c.req.param("chatId");
      if (!id) return requireParam(c, "chat id");

      const messages = await db.select().from(messageTable).where(eq(messageTable.chatId, id));

      return c.json<SuccessResponse<Message[]>>({
        success: true,
        message: "Success",
        data: messages
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const chats = await chatService.getAll(user.id);

      return c.json<SuccessResponse<Chat[]>>({
        success: true,
        message: "Success",
        data: chats
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "chat id");

      const chat = await chatService.get(id);

      return c.json<SuccessResponse<Chat>>({
        success: true,
        message: "Success",
        data: chat
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/create", zValidator("json", chatSchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const chat = await chatService.create({ ...data, userId: user.id });

      return c.json<SuccessResponse<Chat>>({
        success: true,
        message: `${chat.name} created`,
        data: chat
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .put("/update/:id", zValidator("json", chatSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "chat id");

      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const chat = await chatService.update(id, { ...data, userId: user.id });

      return c.json<SuccessResponse<Chat>>({
        success: true,
        message: `${chat.name} updated`,
        data: chat
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "chat id");

      const chat = await chatService.delete(id);

      return c.json<SuccessResponse<Chat>>({
        success: true,
        message: `${chat.name} deleted`,
        data: chat
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
