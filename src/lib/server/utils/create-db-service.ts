import type { Redis } from "@upstash/redis";
import type { Index } from "@upstash/vector";

import { eq, inArray } from "drizzle-orm";
import type { OpenAI } from "openai";
import { APIError } from "openai";

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`);
    this.name = "NotFoundError";
  }
}

export class VectorNotConfiguredError extends Error {
  constructor() {
    super("Vector search not configured: Missing vector or OpenAI instance.");
    this.name = "VectorNotConfiguredError";
  }
}

type Hooks<Input, Result, Ctx> = {
  before?: (args: { input: Input; context: Ctx }) => Promise<void> | void;
  after?: (args: { input: Input; result: Result; context: Ctx }) => Promise<void> | void;
};

type MethodOptions<Input, Result, Ctx> = {
  hooks?: Hooks<Input, Result, Ctx>;
};

type CreateDbServiceHooks<T, FormType> = {
  getAll?: Hooks<string, T[], { userId: string }>;
  get?: Hooks<string, T, { userId: string }>;
  create?: Hooks<FormType, T, { userId: string }>;
  createBulk?: Hooks<FormType[], T[], { userId: string }>;
  update?: Hooks<Partial<FormType>, T, { userId: string; id: string }>;
  delete?: Hooks<string, T, { userId: string; id: string }>;
  deleteAll?: Hooks<string, void, { userId: string }>;
  clearCache?: Hooks<string, void, { userId: string }>;
  search?: Hooks<string, T[], { userId: string }>;
};

export type DbService<T extends { id: string; userId: string }, FormType> = {
  getAll(userId: string, options?: MethodOptions<string, T[], { userId: string }>): Promise<T[]>;
  get(id: string, options?: MethodOptions<string, T, { userId: string }>): Promise<T>;
  create(
    userId: string,
    data: FormType,
    options?: MethodOptions<FormType, T, { userId: string }>
  ): Promise<T>;
  createBulk(
    userId: string,
    data: FormType[],
    options?: MethodOptions<FormType[], T[], { userId: string }>
  ): Promise<T[]>;
  update(
    id: string,
    updates: Partial<FormType>,
    options?: MethodOptions<Partial<FormType>, T, { userId: string; id: string }>
  ): Promise<T>;
  delete(
    id: string,
    options?: MethodOptions<string, T, { userId: string; id: string }>
  ): Promise<T>;
  deleteAll(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void>;
  clearCache(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void>;

  search(
    userId: string,
    query: string,
    limit?: number,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]>;

  searchVector(
    query: string,
    userId: string,
    limit?: number
  ): Promise<{ id: string; score: number }[]>;
  upsertVector(row: T): Promise<void>;
  upsertVectorBulk(rows: T[]): Promise<void>;
  deleteVector(id: string): Promise<void>;

  addHooks(hooks: CreateDbServiceHooks<T, FormType>): void;
};

type VectorConfig<T> = {
  vector: Index;
  openai: OpenAI;
  model?: string;
  textFn: (row: T) => string;
  metadataFn?: (row: T) => Record<string, unknown>;
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
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, args, retries - 1, delay * 2);
    }
    throw error;
  }
}

// -------------------- Main Factory --------------------
export function createDbService<T extends { id: string; userId: string }, FormType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: any;
    kv?: { kv: Redis; kvKeyFn: (userId: string) => string; cacheTime?: number };
    vector?: VectorConfig<T>;
    hooks?: CreateDbServiceHooks<T, FormType>;
  }
): DbService<T, FormType> {
  const { table, kv, vector } = config;

  const globalHooks: CreateDbServiceHooks<T, FormType> = config.hooks || {};
  const addedHooks: CreateDbServiceHooks<T, FormType> = {};

  const mergeHooks = <A, B, C>(...hooks: (Hooks<A, B, C> | undefined)[]): Hooks<A, B, C> => ({
    before: async (args) => {
      for (const hook of hooks) await hook?.before?.(args);
    },
    after: async (args) => {
      for (const hook of hooks) await hook?.after?.(args);
    }
  });

  async function clearCache(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ) {
    if (!kv) return;
    const context = { userId };
    const hooks = mergeHooks(globalHooks.clearCache, addedHooks.clearCache, options?.hooks);
    await hooks.before?.({ input: userId, context });
    await kv.kv.del(kv.kvKeyFn(userId));
    await hooks.after?.({ input: userId, result: undefined, context });
  }

  async function getAll(
    userId: string,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    const context = { userId };
    const hooks = mergeHooks(globalHooks.getAll, addedHooks.getAll, options?.hooks);
    await hooks.before?.({ input: userId, context });

    let data: T[] = [];
    if (kv) {
      const cachedData = await kv.kv.get<T[]>(kv.kvKeyFn(userId));
      if (cachedData) {
        data = cachedData;
      }
    }

    if (data.length === 0) {
      data = await db.select().from(table).where(eq(table.userId, userId));
      if (kv) await kv.kv.set(kv.kvKeyFn(userId), data, { ex: kv.cacheTime ?? 300 });
    }

    await hooks.after?.({ input: userId, result: data, context });
    return data;
  }

  async function get(
    id: string,
    options?: MethodOptions<string, T, { userId: string }>
  ): Promise<T> {
    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) throw new NotFoundError("Row", id);

    const context = { userId: row.userId };
    const hooks = mergeHooks(globalHooks.get, addedHooks.get, options?.hooks);
    await hooks.before?.({ input: id, context });
    await hooks.after?.({ input: id, result: row, context });
    return row;
  }

  async function create(
    userId: string,
    data: FormType,
    options?: MethodOptions<FormType, T, { userId: string }>
  ): Promise<T> {
    const context = { userId };
    const hooks = mergeHooks(globalHooks.create, addedHooks.create, options?.hooks);
    await hooks.before?.({ input: data, context });

    const [row] = await db
      .insert(table)
      .values({ ...data, userId })
      .returning();
    await Promise.all([kv && clearCache(userId), vector && upsertVector(row)]);

    await hooks.after?.({ input: data, result: row, context });
    return row;
  }

  async function createBulk(
    userId: string,
    data: FormType[],
    options?: MethodOptions<FormType[], T[], { userId: string }>
  ): Promise<T[]> {
    if (!data.length) return [];
    const context = { userId };
    const hooks = mergeHooks(globalHooks.createBulk, addedHooks.createBulk, options?.hooks);
    await hooks.before?.({ input: data, context });

    const rows = data.map((item) => ({ ...item, userId }));
    const insertedRows: T[] = await db.insert(table).values(rows).returning();

    await Promise.all([kv && clearCache(userId), vector && upsertVectorBulk(insertedRows)]);

    await hooks.after?.({ input: data, result: insertedRows, context });
    return insertedRows;
  }

  async function update(
    id: string,
    updates: Partial<FormType>,
    options?: MethodOptions<Partial<FormType>, T, { userId: string; id: string }>
  ): Promise<T> {
    const [row] = await db.update(table).set(updates).where(eq(table.id, id)).returning();
    if (!row) throw new NotFoundError("Row", id);

    const context = { userId: row.userId, id };
    const hooks = mergeHooks(globalHooks.update, addedHooks.update, options?.hooks);
    await hooks.before?.({ input: updates, context });

    await Promise.all([kv && clearCache(row.userId), vector && upsertVector(row)]);

    await hooks.after?.({ input: updates, result: row, context });
    return row;
  }

  async function remove(
    id: string,
    options?: MethodOptions<string, T, { userId: string; id: string }>
  ): Promise<T> {
    const [row] = await db.delete(table).where(eq(table.id, id)).returning();
    if (!row) throw new NotFoundError("Row", id);

    const context = { userId: row.userId, id };
    const hooks = mergeHooks(globalHooks.delete, addedHooks.delete, options?.hooks);
    await hooks.before?.({ input: id, context });

    await Promise.all([kv && clearCache(row.userId), vector && deleteVector(row.id)]);

    await hooks.after?.({ input: id, result: row, context });
    return row;
  }

  async function deleteAll(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void> {
    const context = { userId };
    const hooks = mergeHooks(globalHooks.deleteAll, addedHooks.deleteAll, options?.hooks);
    await hooks.before?.({ input: userId, context });

    await db.delete(table).where(eq(table.userId, userId));

    if (kv) await kv.kv.del(kv.kvKeyFn(userId));

    if (vector) {
      const userRows = await db
        .select({ id: table.id })
        .from(table)
        .where(eq(table.userId, userId));
      await Promise.all(userRows.map((r: { id: string }) => deleteVector(r.id)));
    }

    await hooks.after?.({ input: userId, result: undefined, context });
  }

  async function searchVector(
    query: string,
    userId: string,
    limit = 10
  ): Promise<{ id: string; score: number }[]> {
    if (!vector?.openai) throw new VectorNotConfiguredError();

    const queryEmbResponse = await retryWithBackoff(
      vector.openai.embeddings.create.bind(vector.openai.embeddings),
      [{ model: vector.model ?? "text-embedding-3-small", input: query }]
    );

    const results = await vector.vector.query({
      vector: queryEmbResponse.data[0].embedding,
      topK: limit,
      filter: `userId='${userId}'`
    });

    return results.map((r) => ({ id: String(r.id), score: r.score ?? 0 }));
  }

  async function search(
    userId: string,
    query: string,
    limit = 10,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    if (!vector?.openai) throw new VectorNotConfiguredError();

    const context = { userId };
    const hooks = mergeHooks(globalHooks.search, addedHooks.search, options?.hooks);
    await hooks.before?.({ input: query, context });

    const ids = await searchVector(query, userId, limit);
    if (!ids.length) return [];

    const rows = await db
      .select()
      .from(table)
      .where(
        inArray(
          table.id,
          ids.map((i) => i.id)
        )
      );
    const ordered = ids.map(({ id }) => rows.find((r: T) => r.id === id)).filter(Boolean) as T[];

    await hooks.after?.({ input: query, result: ordered, context });
    return ordered;
  }

  async function upsertVector(row: T) {
    if (!vector?.openai) return;
    const text = vector.textFn(row);
    if (!text) return;

    const embeddingResponse = await retryWithBackoff(
      vector.openai.embeddings.create.bind(vector.openai.embeddings),
      [{ model: vector.model ?? "text-embedding-3-small", input: text }]
    );

    await vector.vector.upsert({
      id: row.id,
      vector: embeddingResponse.data[0].embedding,
      metadata: { userId: row.userId, ...(vector.metadataFn?.(row) || {}) }
    });
  }

  async function upsertVectorBulk(rows: T[]) {
    if (!vector?.openai || rows.length === 0) return;

    const BATCH_SIZE = 50;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const texts = batch.map((row) => vector.textFn(row)).filter(Boolean) as string[];
      if (!texts.length) continue;

      const embeddingResponse = await retryWithBackoff(
        vector.openai.embeddings.create.bind(vector.openai.embeddings),
        [{ model: vector.model ?? "text-embedding-3-small", input: texts }]
      );

      const vectorsToUpsert = embeddingResponse.data.map((item, index) => ({
        id: batch[index].id,
        vector: item.embedding,
        metadata: { userId: batch[index].userId, ...(vector.metadataFn?.(batch[index]) || {}) }
      }));

      await vector.vector.upsert(vectorsToUpsert);
    }
  }

  async function deleteVector(id: string) {
    if (!vector) return;
    await vector.vector.delete(id);
  }

  function addHooks(hooks: CreateDbServiceHooks<T, FormType>) {
    Object.assign(addedHooks, hooks);
  }

  return {
    getAll,
    get,
    create,
    createBulk,
    update,
    delete: remove,
    deleteAll,
    clearCache,
    search,
    searchVector,
    upsertVector,
    upsertVectorBulk,
    deleteVector,
    addHooks
  } as const;
}
