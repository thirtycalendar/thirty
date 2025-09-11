import type { UIMessage } from "@ai-sdk/svelte";

import { convertToModelMessages, streamText } from "ai";

import { openRouterGpt4oMini } from "../utils/ai-models";
import { createTools } from "./tools";

export async function streamChat(userId: string, messages: UIMessage[]) {
  const result = streamText({
    model: openRouterGpt4oMini,
    tools: createTools(userId),
    messages: convertToModelMessages(messages)
  });

  return result.toUIMessageStreamResponse();
}
