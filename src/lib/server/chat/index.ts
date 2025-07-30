import { createOpenAI } from "@ai-sdk/openai";

import { streamText, type Message } from "ai";
import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

import { chatTable } from "../db/tables/chat";
import { messageTable } from "../db/tables/message";
import { systemPrompt } from "./prompt";
import { createTools } from "./tools";
import { generateChatName } from "./utils/generate-chat-name";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function streamChat(userId: string, chatId: string, messages: Message[]) {
  const [existingChat] = await db.select().from(chatTable).where(eq(chatTable.id, chatId)).limit(1);

  if (!existingChat) {
    await db.insert(chatTable).values({
      id: chatId,
      name: "New Chat",
      userId
    });

    generateChatName(messages)
      .then((name) => {
        if (name) {
          return db.update(chatTable).set({ name }).where(eq(chatTable.id, chatId));
        }
      })
      .catch((err) => console.error("Chat name error:", err));
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    await db.insert(messageTable).values({
      chatId,
      content: lastMessage.content,
      role: "user"
    });
  }

  const result = streamText({
    model: openAiModel("gpt-4o-mini"),
    messages,
    tools: createTools(userId),
    maxSteps: 30,
    system: systemPrompt,
    onError: (err) => console.error("Streaming error:", err)
  });

  result.steps.then(async (steps) => {
    const completion = steps.map((s) => s.text).join("");
    if (completion.trim()) {
      await db.insert(messageTable).values({
        chatId,
        content: completion,
        role: "assistant"
      });
    }
  });

  return result.toDataStreamResponse();
}
