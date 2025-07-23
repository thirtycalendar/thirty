import type { Redis } from "@upstash/redis";
import type { Index } from "@upstash/vector";

import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import OpenAI from "openai";

/**
 * A hook function that can run before or after a database operation.
 */
type Hook<Input, Result = void, Context = unknown> = (args: {
  input: Input;
  result?: Result;
  context: Context;
}) => Promise<void> | void;

type HookSet<Input, Result = void, Context = unknown> = {
  before?: Hook<Input, Result, Context>;
  after?: Hook<Input, Result, Context>;
};

type MethodOptions<Input, Result = void, Context = unknown> = {
  hooks?: HookSet<Input, Result, Context>;
};

type CreateDbServiceHooks<T extends { id: string; userId: string }, FormType> = {
  getAll?: HookSet<string, T[], { userId: string }>;
  get?: HookSet<string, T, { userId: string }>;
  create?: HookSet<FormType, T, { userId: string }>;
  update?: HookSet<Partial<FormType>, T, { userId: string; id: string }>;
  delete?: HookSet<string, T, { userId: string; id: string }>;
  deleteAll?: HookSet<string, void, { userId: string }>;
  clearCache?: HookSet<string, void, { userId: string }>;
};

type VectorConfig<T> = {
  vector: Index;
  embeddingFn?: (entity: T) => Promise<number[]>; // Custom embedding generator
  textFn?: (entity: T) => string; // If embeddingFn is not given, textFn + OpenAI is used
  model?: string; // OpenAI model for embeddings (default: "text-embedding-3-small")
};

type CreateDbServiceParams<T extends { id: string; userId: string }, FormType> = {
  table: PgTable;
  kv?: {
    kv: Redis;
    kvKeyFn: (userId: string) => string;
    cacheTime: number;
  };
  vector?: VectorConfig<T>;
  hooks?: CreateDbServiceHooks<T, FormType>;
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
  addHooks(hooks: CreateDbServiceHooks<T, FormType>): void;
};

function mergeHooks<Input, Result, Context>(
  global?: HookSet<Input, Result, Context>,
  local?: HookSet<Input, Result, Context>
): HookSet<Input, Result, Context> {
  return {
    before: async (args) => {
      if (global?.before) await global.before(args);
      if (local?.before) await local.before(args);
    },
    after: async (args) => {
      if (global?.after) await global.after(args);
      if (local?.after) await local.after(args);
    }
  };
}

export function createDbService<T extends { id: string; userId: string }, FormType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  params: CreateDbServiceParams<T, FormType>
): DbService<T, FormType> {
  const { table, kv, vector } = params;
  const globalHooks = params.hooks ?? {};
  const addedHooks: CreateDbServiceHooks<T, FormType> = {};

  const openai = vector ? new OpenAI() : undefined;

  const getKvKey = (userId: string) => kv?.kvKeyFn(userId) ?? "";

  function addHooks(newHooks: CreateDbServiceHooks<T, FormType>) {
    for (const key in newHooks) {
      const hookKey = key as keyof CreateDbServiceHooks<T, FormType>;
      const existingSet = addedHooks[hookKey];
      const newSet = newHooks[hookKey];
      // @ts-expect-error — Drizzle doesn't expose column keys generic call
      addedHooks[hookKey] = mergeHooks(existingSet, newSet);
    }
  }

  async function generateEmbedding(entity: T): Promise<number[]> {
    if (!vector) return [];
    if (vector.embeddingFn) return vector.embeddingFn(entity);
    if (!openai) throw new Error("OpenAI client not initialized for embeddings");

    const text = vector.textFn ? vector.textFn(entity) : JSON.stringify(entity);
    const emb = await openai.embeddings.create({
      model: vector.model ?? "text-embedding-3-small",
      input: text
    });
    return emb.data[0].embedding;
  }

  async function upsertVector(entity: T) {
    if (!vector) return;
    const embedding = await generateEmbedding(entity);
    await vector.vector.upsert([
      {
        id: entity.id,
        vector: embedding,
        metadata: { userId: entity.userId }
      }
    ]);
  }

  async function deleteVector(id: string) {
    if (!vector) return;
    await vector.vector.delete([id]);
  }

  async function getAll(
    userId: string,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    const context = { userId };
    const serviceLevelHooks = mergeHooks(globalHooks.getAll, addedHooks.getAll);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: userId, context });

    if (kv) {
      const cached = await kv.kv.get<T[]>(getKvKey(userId));
      if (cached) {
        await hookSet.after?.({ input: userId, result: cached, context });
        return cached;
      }
    }

    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const result = await db.select().from(table).where(eq(table.userId, userId));
    if (kv) await kv.kv.set(getKvKey(userId), result, { ex: kv.cacheTime });

    await hookSet.after?.({ input: userId, result, context });
    return result;
  }

  async function get(
    id: string,
    options?: MethodOptions<string, T, { userId: string }>
  ): Promise<T> {
    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) throw new Error("Not found");

    const context = { userId: row.userId };
    const serviceLevelHooks = mergeHooks(globalHooks.get, addedHooks.get);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: id, context });
    await hookSet.after?.({ input: id, result: row, context });

    return row;
  }

  async function create(
    userId: string,
    data: FormType,
    options?: MethodOptions<FormType, T, { userId: string }>
  ): Promise<T> {
    const context = { userId };
    const serviceLevelHooks = mergeHooks(globalHooks.create, addedHooks.create);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: data, context });

    const [inserted] = await db
      .insert(table)
      .values({ userId, ...data })
      .returning();
    if (!inserted) throw new Error("Insert failed");

    if (kv) {
      const cached = await kv.kv.get<T[]>(getKvKey(userId));
      if (cached) {
        cached.push(inserted);
        await kv.kv.set(getKvKey(userId), cached, { ex: kv.cacheTime });
      } else {
        await kv.kv.set(getKvKey(userId), [inserted], { ex: kv.cacheTime });
      }
    }

    await upsertVector(inserted);
    await hookSet.after?.({ input: data, result: inserted, context });
    return inserted;
  }

  async function update(
    id: string,
    updates: Partial<FormType>,
    options?: MethodOptions<Partial<FormType>, T, { userId: string; id: string }>
  ): Promise<T> {
    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!existing) throw new Error("Not found");

    const context = { userId: existing.userId, id };
    const serviceLevelHooks = mergeHooks(globalHooks.update, addedHooks.update);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: updates, context });

    const [updated] = await db
      .update(table)
      .set({ ...updates, updatedAt: new Date() })
      // @ts-expect-error — Drizzle doesn't expose column keys generically
      .where(eq(table.id, id))
      .returning();
    if (!updated) throw new Error("Update failed");

    if (kv) {
      const cached = await kv.kv.get<T[]>(getKvKey(updated.userId));
      if (cached) {
        const index = cached.findIndex((i) => i.id === id);
        if (index !== -1) {
          cached[index] = updated;
          await kv.kv.set(getKvKey(updated.userId), cached, { ex: kv.cacheTime });
        }
      }
    }

    await upsertVector(updated);
    await hookSet.after?.({ input: updates, result: updated, context });
    return updated;
  }

  async function remove(
    id: string,
    options?: MethodOptions<string, T, { userId: string; id: string }>
  ): Promise<T> {
    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [itemToDelete] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!itemToDelete) throw new Error("Not found");

    const context = { userId: itemToDelete.userId, id };
    const serviceLevelHooks = mergeHooks(globalHooks.delete, addedHooks.delete);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: id, context });

    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [deleted] = await db.delete(table).where(eq(table.id, id)).returning();
    if (!deleted) throw new Error("Delete failed");

    if (kv) {
      const cached = await kv.kv.get<T[]>(getKvKey(deleted.userId));
      if (cached) {
        const filtered = cached.filter((i) => i.id !== id);
        await kv.kv.set(getKvKey(deleted.userId), filtered, { ex: kv.cacheTime });
      }
    }

    await deleteVector(id);
    await hookSet.after?.({ input: id, result: deleted, context });
    return deleted;
  }

  async function deleteAll(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void> {
    const context = { userId };
    const serviceLevelHooks = mergeHooks(globalHooks.deleteAll, addedHooks.deleteAll);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: userId, context });

    // @ts-expect-error — Drizzle doesn't expose column keys generically
    await db.delete(table).where(eq(table.userId, userId));
    await clearCache(userId);

    // Optionally clear all user vectors (Upstash Vector does not support "bulk delete by metadata" yet)
    // Instead, you can track user IDs separately.

    await hookSet.after?.({ input: userId, context });
  }

  async function clearCache(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void> {
    const context = { userId };
    const serviceLevelHooks = mergeHooks(globalHooks.clearCache, addedHooks.clearCache);
    const hookSet = mergeHooks(serviceLevelHooks, options?.hooks);
    await hookSet.before?.({ input: userId, context });

    if (kv) await kv.kv.del(getKvKey(userId));
    await hookSet.after?.({ input: userId, context });
  }

  return {
    getAll,
    get,
    create,
    update,
    delete: remove,
    deleteAll,
    clearCache,
    addHooks
  };
}
