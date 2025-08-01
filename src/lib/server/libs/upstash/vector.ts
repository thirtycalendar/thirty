import { Index } from "@upstash/vector";

import type { OpenAI } from "openai";
import { APIError } from "openai";

import { vectorEnvConfig, vectorHolidayEnvConfig } from "$lib/shared/utils/env-configs";

export const vector = new Index({
  url: vectorEnvConfig.url,
  token: vectorEnvConfig.token
});

export const vectorHoliday = new Index({
  url: vectorHolidayEnvConfig.url,
  token: vectorHolidayEnvConfig.token
});

export class VectorNotConfiguredError extends Error {
  constructor() {
    super("Vector client not configured: Missing vector or OpenAI instance.");
    this.name = "VectorNotConfiguredError";
  }
}

export type VectorClientConfig<T> = {
  namespace: string;
  vector: Index;
  openai: OpenAI;
  modelId?: OpenAI.Embeddings.EmbeddingCreateParams["model"];
  textFn?: (item: T) => string;
  metadataFn?: (item: T) => Record<string, unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function retryWithBackoff<F extends (...args: any[]) => Promise<any>>(
  fn: F,
  args: Parameters<F>,
  retries = 5,
  delay = 1000
): Promise<Awaited<ReturnType<F>>> {
  try {
    return await fn(...args);
  } catch (error) {
    if (
      retries > 0 &&
      error instanceof APIError &&
      (error.status === 429 || error.status === 503)
    ) {
      console.warn(`Rate limit hit, retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      return retryWithBackoff(fn, args, retries - 1, delay * 2);
    }
    throw error;
  }
}

function buildFilterString(filter?: Record<string, string | number>): string | undefined {
  if (!filter || Object.keys(filter).length === 0) return undefined;
  return Object.entries(filter)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(" AND ");
}

export function createVectorClient<T extends { id: string }>(config: VectorClientConfig<T>) {
  const {
    namespace,
    vector,
    openai,
    modelId = "text-embedding-3-small",
    textFn = (i: T) =>
      Object.values(i)
        .filter((value) => value !== null && typeof value !== "undefined")
        .map((value) => String(value))
        .join(" "),
    metadataFn = (item: T) => {
      if ("userId" in item && typeof item.userId === "string") {
        return { userId: item.userId };
      }
      return {};
    }
  } = config;

  if (!vector || !openai) {
    throw new VectorNotConfiguredError();
  }

  const namespacedVector = vector.namespace(namespace);

  async function query(
    queryText: string,
    options: {
      topK?: number;
      filter?: Record<string, string | number>;
    } = {}
  ): Promise<{ id: string; score: number }[]> {
    const { topK = 10, filter } = options;
    const emb = await retryWithBackoff(openai.embeddings.create.bind(openai.embeddings), [
      { model: modelId, input: queryText }
    ]);

    const results = await namespacedVector.query({
      vector: emb.data[0].embedding,
      topK,
      includeMetadata: false,
      includeVectors: false,
      filter: buildFilterString(filter)
    });

    return results.map((r) => ({ id: String(r.id), score: r.score ?? 0 }));
  }

  async function upsert(item: T): Promise<void> {
    const text = textFn(item);
    if (!text) return;

    const emb = await retryWithBackoff(openai.embeddings.create.bind(openai.embeddings), [
      { model: modelId, input: text }
    ]);

    await namespacedVector.upsert({
      id: item.id,
      vector: emb.data[0].embedding,
      metadata: metadataFn(item)
    });
  }

  async function upsertBulk(items: T[]): Promise<void> {
    if (!items.length) return;

    const BATCH_SIZE = 50;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const texts = batch.map(textFn).filter(Boolean) as string[];

      if (!texts.length) continue;

      const emb = await retryWithBackoff(openai.embeddings.create.bind(openai.embeddings), [
        { model: modelId, input: texts }
      ]);

      await namespacedVector.upsert(
        emb.data.map((item, idx) => ({
          id: batch[idx].id,
          vector: item.embedding,
          metadata: metadataFn(batch[idx])
        }))
      );
    }
  }

  async function remove(id: string | string[]): Promise<void> {
    await namespacedVector.delete(id);
  }

  return { query, upsert, upsertBulk, delete: remove };
}

export type VectorClient<T extends { id: string }> = ReturnType<typeof createVectorClient<T>>;
