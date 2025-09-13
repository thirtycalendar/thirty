import type { UIMessage } from "@ai-sdk/svelte";

import { convertToModelMessages, stepCountIs, streamText } from "ai";

// import { chatService } from "../services";
import { openRouterGpt4oMini } from "../utils/ai-models";
import { chatSystemMessage } from "./system-messages";
import { createTools } from "./tools";

export async function streamChat(userId: string, chatId: string, messages: UIMessage[]) {
  const userMessage =
    messages.findLast((m) => m.role === "user")?.parts.find((p) => p.type === "text")?.text ?? "";
  console.log("message:", userMessage);

  // const now = new Date().toISOString();

  // const existingChat = await chatService.maybeGet(chatId);

  // if (!existingChat) {
  //   await chatService.create(userId, { id: chatId, name: "New Chat", userId, updatedAt: now });
  // }

  const result = streamText({
    model: openRouterGpt4oMini,
    system: chatSystemMessage,
    tools: createTools(userId),
    stopWhen: stepCountIs(10),
    messages: convertToModelMessages(messages),
    onFinish: (result) => {
      console.log("text:::", result.text);
    }
  });

  return result.toUIMessageStreamResponse();
}
