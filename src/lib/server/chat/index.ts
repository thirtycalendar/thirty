import { createOpenAI } from "@ai-sdk/openai";

import { streamText, type Message } from "ai";
import { eq } from "drizzle-orm";
import { validate as uuidValidate } from "uuid";

import { db } from "$lib/server/db";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

import { chatTable } from "../db/tables/chat";
import { messageTable } from "../db/tables/message";
import { systemPrompt } from "./prompt";
import { createTools } from "./tools";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function streamChat(userId: string, chatId: string, messages: Message[]) {
  // Validate chatId format
  if (!uuidValidate(chatId)) {
    throw new Error("Invalid chatId format");
  }

  // Check if chat exists, else create it
  const [existingChat] = await db.select().from(chatTable).where(eq(chatTable.id, chatId)).limit(1);

  if (!existingChat) {
    await db.insert(chatTable).values({
      id: chatId,
      name: "New Chat",
      userId
    });
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    await db.insert(messageTable).values({
      chatId,
      content: lastMessage.content,
      role: "user"
    });
  }

  // Stream AI response
  const result = streamText({
    model: openAiModel("gpt-4o-mini"),
    messages,
    tools: createTools(userId),
    maxSteps: 30,
    system: systemPrompt,
    onError: (err) => {
      console.error("Streaming error:", err);
    }
  });

  const response = result.toDataStreamResponse();

  // When steps finish, store assistant's completion in DB
  result.steps.then(async (steps) => {
    const completion = steps.map((s) => s.text).join("");
    if (completion.trim().length > 0) {
      await db.insert(messageTable).values({
        chatId,
        content: completion,
        role: "assistant"
      });
    }
  });

  return response;
}
