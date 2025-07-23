import { createOpenAI } from "@ai-sdk/openai";
import { zValidator } from "@hono/zod-validator";

import { streamText } from "ai";
import { Hono } from "hono";
import { stream } from "hono/streaming";
import { z } from "zod";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

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
    const { messages } = c.req.valid("json");

    const aiStream = streamText({
      model: model("gpt-4.1"),
      messages,
      system: `You are a helpful AI assistant for a smart calendar app. 
                 Your job is to help the user manage events, tasks, and schedules. 
                 If the user asks for something calendar-related, respond naturally and clearly.`
    });

    return stream(c, async (s) => {
      for await (const chunk of aiStream.textStream) {
        await s.write(`0:${JSON.stringify(chunk)}\n`);
      }
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});

export default app;
