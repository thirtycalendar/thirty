import { createOpenAI } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";

import { streamText } from "ai";
import { Hono } from "hono";
import { z } from "zod";

import { createCalendarTools } from "$lib/server/chat/tools";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";
import type { User } from "$lib/shared/types";

import { loggedIn } from "../middlewares/logged-in";
import { errorResponse } from "../utils";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string()
});

const bodySchema = z.object({
  messages: z.array(messageSchema).min(1)
});

const model = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

const app = new Hono().use(loggedIn).post("/", zValidator("json", bodySchema), async (c) => {
  try {
    const user = c.get("user") as User;
    const { messages } = c.req.valid("json");

    const calendarTools = createCalendarTools(user.id);

    const result = streamText({
      model: model("gpt-4.1"),
      messages,
      tools: calendarTools,
      maxSteps: 30,
      system: `You are a helpful AI assistant for a smart calendar app. 
                 Your job is to help the user manage events, tasks, and schedules. 
                 If the user asks for something calendar-related, respond naturally and clearly.`
    });

    return c.body(result.toDataStream(), 200, {
      "Content-Type": "text/plain; charset=utf-8"
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});

export default app;
