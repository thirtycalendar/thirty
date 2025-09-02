import { env } from "$env/dynamic/private";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { createVoyage } from "voyage-ai-provider";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

const voyage = createVoyage({
  baseURL: "https://api.voyageai.com/v1",
  apiKey: env.VOYAGEAI_API_KEY
});

export const openRouterGpt4oMini = openrouter.chat("openai/gpt-4o-mini");

export const voyage3_5Lite = voyage.textEmbeddingModel("voyage-3.5-lite");
