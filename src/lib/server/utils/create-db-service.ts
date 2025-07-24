import type { Redis } from "@upstash/redis";
import type { Index } from "@upstash/vector";

import { eq } from "drizzle-orm";
import type { OpenAI } from "openai";

type MethodOptions<Input, Result, Ctx> = {
  hooks?: Hooks<Input, Result, Ctx>;
};

type Hooks<Input, Result, Ctx> = {
  before?: (args: { input: Input; context: Ctx }) => Promise<void> | void;
  after?: (args: { input: Input; result: Result; context: Ctx }) => Promise<void> | void;
};

type CreateDbServiceHooks<T, FormType> = {
  getAll?: Hooks<string, T[], { userId: string }>;
  get?: Hooks<string, T, { userId: string }>;
  create?: Hooks<FormType, T, { userId: string }>;
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
  searchVector(query: string, userId: string, limit?: number): Promise<string[]>;
  upsertVector(row: T): Promise<void>;
  deleteVector(id: string): Promise<void>;

  addHooks(hooks: CreateDbServiceHooks<T, FormType>): void;
};

type VectorConfig<T> = {
  vector: Index;
  model?: string;
  textFn: (row: T) => string;
};

export function createDbService<T extends { id: string; userId: string }, FormType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: any;
    kv?: { kv: Redis; kvKeyFn: (userId: string) => string; cacheTime?: number };
    vector?: VectorConfig<T>;
    openai?: OpenAI;
  }
): DbService<T, FormType> {
  const { table, kv, vector, openai } = config;
  const globalHooks: CreateDbServiceHooks<T, FormType> = {};
  const addedHooks: CreateDbServiceHooks<T, FormType> = {};

  function mergeHooks<A, B, C>(...hooks: (Hooks<A, B, C> | undefined)[]): Hooks<A, B, C> {
    return {
      before: async (args) => {
        for (const hook of hooks) await hook?.before?.(args);
      },
      after: async (args) => {
        for (const hook of hooks) await hook?.after?.(args);
      }
    };
  }

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
      const cached = await kv.kv.get<T[]>(kv.kvKeyFn(userId));
      if (cached) data = cached;
    }
    if (!data.length) {
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
    const context = { userId: options?.hooks?.before ? "unknown" : "" };
    const hooks = mergeHooks(globalHooks.get, addedHooks.get, options?.hooks);
    await hooks.before?.({ input: id, context });

    const row = await db.select().from(table).where(eq(table.id, id)).limit(1);
    const result = row[0] as T;

    await hooks.after?.({ input: id, result, context });
    return result;
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
    if (kv) await clearCache(userId);
    if (vector) await upsertVector(row);

    await hooks.after?.({ input: data, result: row, context });
    return row;
  }

  async function update(
    id: string,
    updates: Partial<FormType>,
    options?: MethodOptions<Partial<FormType>, T, { userId: string; id: string }>
  ): Promise<T> {
    const context = { userId: options?.hooks?.before ? "unknown" : "", id };
    const hooks = mergeHooks(globalHooks.update, addedHooks.update, options?.hooks);
    await hooks.before?.({ input: updates, context });

    const [row] = await db.update(table).set(updates).where(eq(table.id, id)).returning();
    if (kv) await clearCache(row.userId);
    if (vector) await upsertVector(row);

    await hooks.after?.({ input: updates, result: row, context });
    return row;
  }

  async function remove(
    id: string,
    options?: MethodOptions<string, T, { userId: string; id: string }>
  ): Promise<T> {
    const context = { userId: options?.hooks?.before ? "unknown" : "", id };
    const hooks = mergeHooks(globalHooks.delete, addedHooks.delete, options?.hooks);
    await hooks.before?.({ input: id, context });

    const [row] = await db.delete(table).where(eq(table.id, id)).returning();
    if (kv) await clearCache(row.userId);
    if (vector) await deleteVector(row.id);

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
    if (kv) await clearCache(userId);

    await hooks.after?.({ input: userId, result: undefined, context });
  }

  async function searchVector(query: string, userId: string, limit = 10): Promise<string[]> {
    if (!vector || !openai) throw new Error("Vector search not configured");

    const queryEmb = await openai.embeddings.create({
      model: vector.model ?? "text-embedding-3-small",
      input: query
    });

    const results = await vector.vector.query({
      vector: queryEmb.data[0].embedding,
      topK: limit,
      filter: `userId='${userId}'`
    });

    return results.map((r) => String(r.id));
  }

  async function search(
    userId: string,
    query: string,
    limit = 10,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    if (!vector || !openai) throw new Error("Vector search not configured");

    const context = { userId };
    const hooks = mergeHooks(globalHooks.search, addedHooks.search, options?.hooks);
    await hooks.before?.({ input: query, context });

    const ids = await searchVector(query, userId, limit);
    if (!ids.length) return [];

    const rows = await db
      .select()
      .from(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .where((tbl: any) => tbl.id.in(ids));
    const ordered = ids.map((id) => rows.find((r: T) => r.id === id)).filter(Boolean) as T[];

    await hooks.after?.({ input: query, result: ordered, context });
    return ordered;
  }

  async function upsertVector(row: T) {
    if (!vector || !openai) return;
    const text = vector.textFn(row);
    const emb = await openai.embeddings.create({
      model: vector.model ?? "text-embedding-3-small",
      input: text
    });
    await vector.vector.upsert({
      id: row.id,
      vector: emb.data[0].embedding,
      metadata: { userId: row.userId }
    });
  }

  async function deleteVector(id: string) {
    if (!vector) return;
    await vector.vector.delete({ ids: [id] });
  }

  function addHooks(hooks: CreateDbServiceHooks<T, FormType>) {
    Object.assign(addedHooks, hooks);
  }

  return {
    getAll,
    get,
    create,
    update,
    delete: remove,
    deleteAll,
    clearCache,
    search,
    searchVector,
    upsertVector,
    deleteVector,
    addHooks
  };
}
