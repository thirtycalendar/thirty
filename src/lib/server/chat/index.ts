import type { UIMessage } from "@ai-sdk/svelte";

import { convertToModelMessages, stepCountIs, streamText } from "ai";

import { MAX_INPUT_LENGTH } from "$lib/shared/constants";

import { chatService, messageService } from "../services";
import { openRouterGpt4oMini } from "../utils/ai-models";
import { chatSystemMessage } from "./system-messages";
import { createTools } from "./tools";
import { generateChatName } from "./utils/generate-chat-name";

interface Props {
  userId: string;
  name: string;
  chatId: string;
  messages: UIMessage[];
}

export async function streamChat({ userId, name, chatId, messages }: Props) {
  const now = new Date().toISOString();

  const userMessage =
    messages.findLast((m) => m.role === "user")?.parts.find((p) => p.type === "text")?.text ?? "";

  if (userMessage.length > MAX_INPUT_LENGTH) {
    throw new Error(`User message exceeds ${MAX_INPUT_LENGTH} characters.`);
  }

  const existingChat = await chatService.maybeGet(chatId);
  if (!existingChat) {
    await chatService.create(userId, {
      id: chatId,
      name: "New Chat",
      userId,
      updatedAt: now
    });

    generateChatName(userMessage)
      .then((name) => {
        if (name) {
          chatService
            .update(chatId, { name })
            .catch((err) => console.error("Error updating chat name:", err));
        }
      })
      .catch((err) => console.error("Chat name generation error:", err));
  }

  await messageService.create({
    chatId,
    text: userMessage,
    role: "user"
  });
  await chatService.update(chatId, { updatedAt: now });

  const result = streamText({
    model: openRouterGpt4oMini,
    system: chatSystemMessage(name),
    tools: createTools(userId),
    stopWhen: stepCountIs(10),
    messages: convertToModelMessages(messages),
    onFinish: async (result) => {
      await messageService.create({
        chatId,
        text: result.text,
        role: "assistant"
      });
      await chatService.update(chatId, { updatedAt: now });
    }
  });

  return result.toUIMessageStreamResponse();
}
