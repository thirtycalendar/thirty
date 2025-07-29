import { createOpenAI } from "@ai-sdk/openai";

import { streamText, type Message } from "ai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

import { systemPrompt } from "./prompt";
import { createTools } from "./tools";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function streamChat(userId: string, messages: Message[]) {
  const result = streamText({
    model: openAiModel("gpt-4o-mini"),
    messages,
    tools: createTools(userId),
    maxSteps: 30,
    system: systemPrompt
  });

  return result.toDataStreamResponse();
}
