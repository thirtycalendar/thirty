import { createOpenAI } from "@ai-sdk/openai";

import { streamText, type Message } from "ai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

import { createTools } from "./tools";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function streamChat(userId: string, messages: Message[]) {
  // const lastMessage = messages[messages.length - 1];

  const result = streamText({
    model: openAiModel("gpt-4o-mini"),
    messages,
    tools: createTools(userId),
    maxSteps: 100,
    system: `You are a helpful AI assistant for a smart calendar app. 
                 Your job is to help the user manage events, tasks, and schedules. 
                 If the user asks for something calendar-related, respond naturally and clearly.
                 The current date is: ${new Date()}.`
  });

  return result.toDataStreamResponse();
}
