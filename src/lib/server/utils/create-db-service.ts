import type { Redis } from "@upstash/redis";

import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

/**
 * A hook function that can run before or after a database operation.
 *
 * @template Input - The type of the input argument for the method.
 * @template Result - The result type of the method.
 * @template Context - Additional context passed to hooks.
 */
type Hook<Input, Result = void, Context = unknown> = (args: {
  input: Input;
  result?: Result;
  context: Context;
}) => Promise<void> | void;

/**
 * Represents a set of hooks (`before` and `after`) for a given method.
 */
type HookSet<Input, Result = void, Context = unknown> = {
  before?: Hook<Input, Result, Context>;
  after?: Hook<Input, Result, Context>;
};

/**
 * Method-level options to override hooks during a single call.
 */
type MethodOptions<Input, Result = void, Context = unknown> = {
  hooks?: HookSet<Input, Result, Context>;
};

/**
 * Global hooks for all CRUD operations of the service.
 *
 * @template T - Entity type (must have `id` and `userId`).
 * @template FormType - Input form type for create/update.
 */
type CreateDbServiceHooks<T extends { id: string; userId: string }, FormType> = {
  getAll?: HookSet<string, T[], { userId: string }>;
  get?: HookSet<string, T, { userId: string }>;
  create?: HookSet<FormType, T, { userId: string }>;
  update?: HookSet<Partial<FormType>, T, { userId: string; id: string }>;
  delete?: HookSet<string, T, { userId: string; id: string }>;
  deleteAll?: HookSet<string, void, { userId: string }>;
  clearCache?: HookSet<string, void, { userId: string }>;
};

/**
 * Parameters for creating a database service.
 *
 * @template T - Entity type (must have `id` and `userId`).
 * @template FormType - Input form type for create/update.
 */
type CreateDbServiceParams<T extends { id: string; userId: string }, FormType> = {
  table: PgTable;
  kv?: {
    kv: Redis;
    kvKeyFn: (userId: string) => string;
    cacheTime: number;
  };
  hooks?: CreateDbServiceHooks<T, FormType>;
};

/**
 * Database service interface with CRUD operations, cache control, and hooks.
 */
export type DbService<T extends { id: string; userId: string }, FormType> = {
  /**
   * Fetch all rows for a given user.
   *
   * @param userId - The user ID to fetch records for.
   * @param options - Optional hooks for this call.
   * @returns A promise resolving to an array of entities.
   */
  getAll(userId: string, options?: MethodOptions<string, T[], { userId: string }>): Promise<T[]>;

  /**
   * Fetch a single row by ID.
   *
   * @param id - The entity ID.
   * @param options - Optional hooks for this call.
   * @throws If the entity is not found.
   * @returns A promise resolving to the entity.
   */
  get(id: string, options?: MethodOptions<string, T, { userId: string }>): Promise<T>;

  /**
   * Insert a new entity for the given user.
   *
   * @param userId - The user ID to associate with the new record.
   * @param data - The data to insert.
   * @param options - Optional hooks for this call.
   * @throws If insertion fails.
   * @returns A promise resolving to the inserted entity.
   */
  create(
    userId: string,
    data: FormType,
    options?: MethodOptions<FormType, T, { userId: string }>
  ): Promise<T>;

  /**
   * Update an existing entity by ID.
   *
   * @param id - The entity ID.
   * @param updates - Partial data to update.
   * @param options - Optional hooks for this call.
   * @throws If the entity is not found or update fails.
   * @returns A promise resolving to the updated entity.
   */
  update(
    id: string,
    updates: Partial<FormType>,
    options?: MethodOptions<Partial<FormType>, T, { userId: string; id: string }>
  ): Promise<T>;

  /**
   * Delete a single entity by ID.
   *
   * @param id - The entity ID.
   * @param options - Optional hooks for this call.
   * @throws If the entity is not found or deletion fails.
   * @returns A promise resolving to the deleted entity.
   */
  delete(
    id: string,
    options?: MethodOptions<string, T, { userId: string; id: string }>
  ): Promise<T>;

  /**
   * Delete all entities for a given user.
   *
   * @param userId - The user ID.
   * @param options - Optional hooks for this call.
   */
  deleteAll(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void>;

  /**
   * Clear the cache for a given user.
   *
   * @param userId - The user ID.
   * @param options - Optional hooks for this call.
   */
  clearCache(
    userId: string,
    options?: MethodOptions<string, void, { userId: string }>
  ): Promise<void>;

  /**
   * Dynamically add more hooks to the service.
   *
   * @param hooks - The hooks to add.
   */
  addHooks(hooks: CreateDbServiceHooks<T, FormType>): void;
};

/**
 * Merges global, added, and method-level hooks into a single `HookSet`.
 */
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

/**
 * Create a fully-featured database service for a given table, with support for:
 * - CRUD operations (`getAll`, `get`, `create`, `update`, `delete`, `deleteAll`).
 * - Redis caching (via Upstash).
 * - Global and per-method hooks (`before` and `after`).
 *
 * @template T - Entity type. **Must have `id: string` and `userId: string`.**
 * @template FormType - Type of the data used for create/update operations.
 *
 * @param db - A Drizzle PostgreSQL database instance.
 * @param params - Configuration including table, optional Redis KV, and hooks.
 *
 * @warning
 * - `T` must include `id` and `userId` properties.
 * - `db` must be a valid **Drizzle PostgreSQL instance**.
 *
 * @returns A `DbService` instance with typed CRUD methods.
 */
export function createDbService<T extends { id: string; userId: string }, FormType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  params: CreateDbServiceParams<T, FormType>
): DbService<T, FormType> {
  const { table, kv } = params;
  const globalHooks = params.hooks ?? {};
  const addedHooks: CreateDbServiceHooks<T, FormType> = {};

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
