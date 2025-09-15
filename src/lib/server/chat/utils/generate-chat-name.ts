import { generateText, stepCountIs } from "ai";

import { openRouterGpt4oMini } from "$lib/server/utils/ai-models";

import { generateChatNameSystemMessage } from "../system-messages";

export async function generateChatName(message: string): Promise<string> {
  const { text } = await generateText({
    model: openRouterGpt4oMini,
    system: generateChatNameSystemMessage(),
    messages: [{ role: "user", content: message }],
    stopWhen: stepCountIs(2)
  });

  return text;
}
