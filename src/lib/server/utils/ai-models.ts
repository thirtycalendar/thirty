import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { openAiEnvConfig, openRouterEnvConfig } from "./env-config";

const openai = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

const openrouter = createOpenRouter({ apiKey: openRouterEnvConfig.apiKey });

export const openAiGpt4oMini = openai("gpt-4o-mini");

export const openRouterGpt4oMini = openrouter("openai/gpt-4o-mini");
