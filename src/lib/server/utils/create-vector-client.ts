import type { Index } from "@upstash/vector";

import { createVoyage } from "voyage-ai-provider";

type VoyageModelId =
  | "voyage-3-large"
  | "voyage-3.5"
  | "voyage-3.5-lite"
  | "voyage-code-3"
  | "voyage-finance-2"
  | "voyage-law-2"
  | "voyage-multilingual-2"
  | "voyage-code-2"
  | "voyage-2";

export class VectorNotConfiguredError extends Error {
  constructor() {
    super("Vector client not configured: Missing vector or embedding model.");
    this.name = "VectorNotConfiguredError";
  }
}

export type VectorClientConfig<T> = {
  namespace: string;
  vector: Index;
  voyageApiKey: string;
  modelId?: VoyageModelId;
  textFn?: (item: T) => string;
  metadataFn?: (item: T) => Record<string, unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function retryWithBackoff<F extends (...args: any[]) => Promise<any> | PromiseLike<any>>(
  fn: F,
  args: Parameters<F>,
  retries = 5,
  delay = 1000
): Promise<Awaited<ReturnType<F>>> {
  try {
    const result = await Promise.resolve(fn(...args));
    return result;
  } catch (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;

    if (retries > 0 && status && (status === 429 || status === 503)) {
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
    voyageApiKey,
    modelId = "voyage-3.5-lite",
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

  const voyage = createVoyage({
    baseURL: "https://api.voyageai.com/v1",
    apiKey: voyageApiKey
  });

  const embeddingModel = voyage.textEmbeddingModel(modelId);

  if (!vector || !embeddingModel) {
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

    const emb = await retryWithBackoff(embeddingModel.doEmbed.bind(embeddingModel), [
      { values: [queryText] }
    ]);

    const results = await namespacedVector.query({
      vector: emb.embeddings[0],
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

    const emb = await retryWithBackoff(embeddingModel.doEmbed.bind(embeddingModel), [
      { values: [text] }
    ]);

    await namespacedVector.upsert({
      id: item.id,
      vector: emb.embeddings[0],
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

      const emb = await retryWithBackoff(embeddingModel.doEmbed.bind(embeddingModel), [
        { values: texts }
      ]);

      await namespacedVector.upsert(
        emb.embeddings.map((vector, idx) => ({
          id: batch[idx].id,
          vector,
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
