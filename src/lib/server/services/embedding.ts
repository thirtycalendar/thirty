import { createOpenAI } from "@ai-sdk/openai";

import { embed } from "ai";

import { openAiEnvConfig } from "$lib/shared/utils/env-configs";
import type { EventForm } from "$lib/shared/types";

const openai = createOpenAI({ apiKey: openAiEnvConfig.apiKey });
const embeddingModel = openai.embedding("text-embedding-3-small");

// Combine event fields into a single string for better embedding context
function getEventEmbeddingText(event: Partial<EventForm>): string {
  return `Name: ${event.name || ""}; Description: ${event.description || ""}; Location: ${event.location || ""}`;
}

export async function generateEventEmbedding(eventData: Partial<EventForm>) {
  const text = getEventEmbeddingText(eventData);
  const { embedding } = await embed({
    model: embeddingModel,
    value: text
  });
  return embedding;
}
