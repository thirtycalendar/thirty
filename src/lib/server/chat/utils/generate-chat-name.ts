import { generateText, type Message } from "ai";

import { openRouterGpt4oMini } from "$lib/server/utils/ai-models";

import { generateChatNameSystemMessage } from "../system-messages";

export async function generateChatName(messages: Message[]): Promise<string> {
  const userMessage = messages.findLast((m) => m.role === "user")?.content ?? "";

  const { text } = await generateText({
    model: openRouterGpt4oMini,
    system: generateChatNameSystemMessage,
    messages: [{ role: "user", content: userMessage }],
    maxTokens: 30
  });

  return text;
}
