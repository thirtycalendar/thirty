import { createOpenAI } from "@ai-sdk/openai";

import { streamText, type Message } from "ai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

import { chatService } from "../services/chat";
import { messageService } from "../services/message";
import { systemPrompt } from "./prompt";
import { createTools } from "./tools";
import { generateChatName } from "./utils/generate-chat-name";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function streamChat(userId: string, chatId: string, messages: Message[]) {
  const existingChat = await chatService.maybeGet(chatId);

  if (!existingChat) {
    await chatService.create({ id: chatId, name: "New Chat", userId });

    generateChatName(messages)
      .then((name) => {
        if (name) chatService.update(chatId, { name });
      })
      .catch((err) => console.error("Chat name error:", err));
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    await messageService.create({ chatId, content: lastMessage.content, role: "user" });
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
      await messageService.create({ chatId, content: completion, role: "assistant" });
    }
  });

  return result.toDataStreamResponse();
}
