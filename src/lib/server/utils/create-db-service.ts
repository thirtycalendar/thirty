import type { Redis } from "@upstash/redis";

import { and, eq, inArray } from "drizzle-orm";

import {
  createVectorClient,
  VectorNotConfiguredError,
  type VectorClientConfig
} from "../libs/upstash/vector";

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`);
    this.name = "NotFoundError";
  }
}

type Hooks<Input, Result, Ctx> = {
  before?: (args: { input: Input; context: Ctx }) => Promise<void> | void;
  after?: (args: { input: Input; result: Result; context: Ctx }) => Promise<void> | void;
};

type MethodOptions<Input, Result, Ctx> = {
  hooks?: Hooks<Input, Result, Ctx>;
  skipHooks?: boolean;
};

type CreateDbServiceHooks<T, FormType> = {
  getAll?: Hooks<string, T[], { userId: string }>;
  get?: Hooks<string, T, { userId: string }>;
  maybeGet?: Hooks<string, T | null, { userId: string }>;
  maybeGetByUser?: Hooks<string, T | null, { userId: string }>;
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
  maybeGet(
    id: string,
    options?: MethodOptions<string, T | null, { userId: string }>
  ): Promise<T | null>;
  maybeGetByUser(
    userId: string,
    id: string,
    options?: MethodOptions<string, T | null, { userId: string }>
  ): Promise<T | null>;
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
  addHooks(hooks: CreateDbServiceHooks<T, FormType>): void;
};

export function createDbService<T extends { id: string; userId: string }, FormType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: any;
    kv?: { kv: Redis; kvKeyFn: (userId: string) => string; cacheTime?: number };
    vector?: VectorClientConfig<T>;
    hooks?: CreateDbServiceHooks<T, FormType>;
  }
): DbService<T, FormType> {
  const { table, kv, vector } = config;

  const vectorClient = vector ? createVectorClient(vector) : null;

  const globalHooks: CreateDbServiceHooks<T, FormType> = config.hooks || {};
  const addedHooks: CreateDbServiceHooks<T, FormType> = {};

  const mergeHooks = <A, B, C>(...hooks: (Hooks<A, B, C> | undefined)[]): Hooks<A, B, C> => ({
    before: async (args) => {
      for (const h of hooks) await h?.before?.(args);
    },
    after: async (args) => {
      for (const h of hooks) await h?.after?.(args);
    }
  });

  async function clearCache(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ) {
    if (!kv) return;

    const context = { userId };

    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.clearCache, addedHooks.clearCache, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: userId, context });

    await kv.kv.del(kv.kvKeyFn(userId));

    await hooks.after?.({ input: userId, result: undefined, context });
  }

  async function getAll(
    userId: string,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    const context = { userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.getAll, addedHooks.getAll, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);
    await hooks.before?.({ input: userId, context });

    let data: T[] = [];
    if (kv) {
      const cached = await kv.kv.get<T[]>(kv.kvKeyFn(userId));
      if (cached) data = cached;
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
    const [preRow] = await db
      .select({ userId: table.userId })
      .from(table)
      .where(eq(table.id, id))
      .limit(1);

    if (!preRow) throw new NotFoundError("Row", id);

    const context = { userId: preRow.userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.get, addedHooks.get, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: id, context });

    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) throw new NotFoundError("Row", id);

    await hooks.after?.({ input: id, result: row, context });
    return row;
  }

  async function maybeGet(
    id: string,
    options?: MethodOptions<string, T | null, { userId: string }>
  ): Promise<T | null> {
    const [preRow] = await db
      .select({ userId: table.userId })
      .from(table)
      .where(eq(table.id, id))
      .limit(1);

    if (!preRow) return null;

    const context = { userId: preRow.userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.get, addedHooks.get, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: id, context });

    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) return null;

    await hooks.after?.({ input: id, result: row, context });
    return row;
  }

  async function maybeGetByUser(
    userId: string,
    id: string,
    options?: MethodOptions<string, T | null, { userId: string }>
  ): Promise<T | null> {
    const context = { userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.get, addedHooks.get, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: id, context });

    const [row] = await db
      .select()
      .from(table)
      .where(and(eq(table.id, id), eq(table.userId, userId)))
      .limit(1);

    if (!row) return null;

    await hooks.after?.({ input: id, result: row, context });
    return row;
  }

  async function create(
    userId: string,
    data: FormType,
    options?: MethodOptions<FormType, T, { userId: string }>
  ): Promise<T> {
    const context = { userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.create, addedHooks.create, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);
    await hooks.before?.({ input: data, context });

    const [row] = await db
      .insert(table)
      .values({ ...data, userId })
      .returning();

    await Promise.all([kv && clearCache(userId), vectorClient && vectorClient.upsert(row)]);

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
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.createBulk, addedHooks.createBulk, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);
    await hooks.before?.({ input: data, context });

    const rows = data.map((d) => ({ ...d, userId }));
    const inserted: T[] = await db.insert(table).values(rows).returning();

    await Promise.all([
      kv && clearCache(userId),
      vectorClient && vectorClient.upsertBulk(inserted)
    ]);

    await hooks.after?.({ input: data, result: inserted, context });
    return inserted;
  }

  async function update(
    id: string,
    updates: Partial<FormType>,
    options?: MethodOptions<Partial<FormType>, T, { userId: string; id: string }>
  ): Promise<T> {
    const [preRow] = await db
      .select({ userId: table.userId })
      .from(table)
      .where(eq(table.id, id))
      .limit(1);
    if (!preRow) throw new NotFoundError("Row", id);

    const context = { userId: preRow.userId, id };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.update, addedHooks.update, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: updates, context });

    const [row] = await db
      .update(table)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(table.id, id))
      .returning();
    if (!row) throw new NotFoundError("Row", id);

    await Promise.all([kv && clearCache(row.userId), vectorClient && vectorClient.upsert(row)]);

    await hooks.after?.({ input: updates, result: row, context });
    return row;
  }

  async function remove(
    id: string,
    options?: MethodOptions<string, T, { userId: string; id: string }>
  ): Promise<T> {
    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) throw new NotFoundError("Row", id);

    const context = { userId: row.userId, id };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.delete, addedHooks.delete, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: id, context });

    await db.delete(table).where(eq(table.id, id));

    await Promise.all([kv && clearCache(row.userId), vectorClient && vectorClient.delete(id)]);

    await hooks.after?.({ input: id, result: row, context });
    return row;
  }

  async function deleteAll(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void> {
    const context = { userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.deleteAll, addedHooks.deleteAll, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

    await hooks.before?.({ input: userId, context });

    if (vectorClient) {
      const userRows = await db
        .select({ id: table.id })
        .from(table)
        .where(eq(table.userId, userId));

      await vectorClient.delete(userRows.map((r: { id: string }) => r.id));
    }

    await db.delete(table).where(eq(table.userId, userId));
    if (kv) await kv.kv.del(kv.kvKeyFn(userId));

    await hooks.after?.({ input: userId, result: undefined, context });
  }

  async function searchVector(
    query: string,
    userId: string,
    limit = 10
  ): Promise<{ id: string; score: number }[]> {
    if (!vectorClient) throw new VectorNotConfiguredError();
    return vectorClient.query(query, { topK: limit, filter: { userId } });
  }

  async function search(
    userId: string,
    query: string,
    limit = 10,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    if (!vector?.openai) throw new VectorNotConfiguredError();

    const context = { userId };
    const hooksToMerge = options?.skipHooks
      ? [options?.hooks]
      : [globalHooks.search, addedHooks.search, options?.hooks];
    const hooks = mergeHooks(...hooksToMerge);

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

  function addHooks(hooks: CreateDbServiceHooks<T, FormType>) {
    Object.assign(addedHooks, hooks);
  }

  return {
    getAll,
    get,
    maybeGet,
    maybeGetByUser,
    create,
    createBulk,
    update,
    delete: remove,
    deleteAll,
    clearCache,
    search,
    addHooks
  } as const;
}
