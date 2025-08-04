import { streamText, type Message } from "ai";

import { chatService } from "../services/chat";
import { messageService } from "../services/message";
import { openRouterGpt4oMini } from "../utils/ai-models";
import { chatSystemMessage } from "./system-messages";
import { createTools } from "./tools";
import { generateChatName } from "./utils/generate-chat-name";

export async function streamChat(userId: string, chatId: string, messages: Message[]) {
  const now = new Date().toISOString();

  const existingChat = await chatService.maybeGet(chatId);

  if (!existingChat) {
    await chatService.create(userId, { id: chatId, name: "New Chat", userId, updatedAt: now });

    generateChatName(messages)
      .then((name) => {
        if (name) {
          chatService
            .update(chatId, { name })
            .catch((err) => console.error("Error updating chat name:", err));
        }
      })
      .catch((err) => console.error("Chat name generation error:", err));
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    await messageService.create({ chatId, content: lastMessage.content, role: "user" });

    await chatService
      .update(chatId, { updatedAt: now })
      .catch((err) => console.error("Error updating chat timestamp after user message:", err));
  }

  const result = streamText({
    model: openRouterGpt4oMini,
    messages,
    tools: createTools(userId),
    maxSteps: 30,
    system: chatSystemMessage,
    onError: (err) => console.error("Streaming error:", err)
  });

  result.steps.then(async (steps) => {
    const completion = steps.map((s) => s.text).join("");
    if (completion.trim()) {
      await messageService.create({ chatId, content: completion, role: "assistant" });

      await chatService
        .update(chatId, { updatedAt: new Date().toISOString() })
        .catch((err) =>
          console.error("Error updating chat timestamp after assistant message:", err)
        );
    }
  });

  return result.toDataStreamResponse();
}
