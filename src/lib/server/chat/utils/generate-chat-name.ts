import { createOpenAI } from "@ai-sdk/openai";

import { generateText, type Message } from "ai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

import { generateChatNameSystemMessage } from "../system-messages";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function generateChatName(messages: Message[]): Promise<string> {
  const userMessage = messages.findLast((m) => m.role === "user")?.content ?? "";

  const { text } = await generateText({
    model: openAiModel("gpt-4o-mini"),
    system: generateChatNameSystemMessage,
    messages: [{ role: "user", content: userMessage }],
    maxTokens: 30
  });

  return text;
}
