import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { createVoyage } from "voyage-ai-provider";

import { openAiEnvConfig, openRouterEnvConfig, voyageAiEnvConfig } from "./env-config";

const openai = createOpenAI({ apiKey: openAiEnvConfig.apiKey });

const openrouter = createOpenRouter({ apiKey: openRouterEnvConfig.apiKey });

const voyage = createVoyage({
  baseURL: "https://api.voyageai.com/v1",
  apiKey: voyageAiEnvConfig.apiKey
});

export const openAiGpt4oMini = openai("gpt-4o-mini");

export const openRouterGpt4oMini = openrouter.chat("openai/gpt-4o-mini");

export const voyage3_5Lite = voyage.textEmbeddingModel("voyage-3.5-lite");
