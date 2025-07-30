import { createOpenAI } from "@ai-sdk/openai";

import { generateText, type Message } from "ai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";

const openAiModel = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

export async function generateChatName(messages: Message[]): Promise<string> {
  const firstUserMessage = messages.findLast((m) => m.role === "user")?.content ?? "";

  const { text } = await generateText({
    model: openAiModel("gpt-4o-mini"),
    system: `You are an assistant that generates short, descriptive chat titles based on the user's message. 
Use a neutral, professional tone. Avoid conversational fluff or jokes. 
Keep it under 5 words. Capitalize Each Word Like a Title.`,
    messages: [{ role: "user", content: firstUserMessage }],
    maxTokens: 30
  });

  return text;
}
