import { env } from "$env/dynamic/private";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { createVoyage } from "voyage-ai-provider";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

const voyage = createVoyage({
  baseURL: "https://api.voyageai.com/v1",
  apiKey: env.VOYAGEAI_API_KEY
});

// OpenAI
export const gpt4oMini = openrouter.chat("openai/gpt-4o-mini");
export const gpto4Mini = openrouter.chat("openai/o4-mini");

// Google
export const gemini2_5Pro = openrouter.chat("google/gemini-2.5-pro");

export const voyage3_5Lite = voyage.textEmbeddingModel("voyage-3.5-lite");
