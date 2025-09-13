import { generateText, stepCountIs, type UIMessage } from "ai";

import { openRouterGpt4oMini } from "$lib/server/utils/ai-models";

import { generateChatNameSystemMessage } from "../system-messages";

export async function generateChatName(messages: UIMessage[]): Promise<string> {
  const lastUserMessage = messages.filter((m) => m.role === "user").at(-1);

  if (!lastUserMessage) {
    throw new Error("No user message found to generate chat name.");
  }

  const { text } = await generateText({
    model: openRouterGpt4oMini,
    system: generateChatNameSystemMessage,
    messages: [{ role: "user", content: lastUserMessage.role }],
    stopWhen: stepCountIs(5)
  });

  return text;
}
