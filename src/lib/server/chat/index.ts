import type { UIMessage } from "@ai-sdk/svelte";

import { convertToModelMessages, streamText } from "ai";

import { openRouterGpt4oMini } from "../utils/ai-models";

export async function streamChat(messages: UIMessage[]) {
  const result = streamText({
    model: openRouterGpt4oMini,
    messages: convertToModelMessages(messages)
  });

  return result.toUIMessageStreamResponse();
}
