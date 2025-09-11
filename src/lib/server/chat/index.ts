import type { UIMessage } from "@ai-sdk/svelte";

import { convertToModelMessages, stepCountIs, streamText } from "ai";

import { openRouterGpt4oMini } from "../utils/ai-models";
import { chatSystemMessage } from "./system-messages";
import { createTools } from "./tools";

export async function streamChat(userId: string, messages: UIMessage[]) {
  const result = streamText({
    model: openRouterGpt4oMini,
    system: chatSystemMessage,
    tools: createTools(userId),
    stopWhen: stepCountIs(10),
    messages: convertToModelMessages(messages),
    onChunk: (event) => {
      console.log("event chunk", event.chunk);
    }
  });

  return result.toUIMessageStreamResponse();
}
