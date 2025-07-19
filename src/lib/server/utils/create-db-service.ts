import type { Redis } from "@upstash/redis";

import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

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

type CreateDbServiceParams<T extends { id: string; userId: string }, FormType> = {
  table: PgTable;
  kv?: {
    kv: Redis;
    kvKeyFn: (userId: string) => string;
    cacheTime: number;
  };
  hooks?: {
    getAll?: HookSet<string, T[], { userId: string }>;
    get?: HookSet<string, T, { userId: string }>;
    create?: HookSet<FormType, T, { userId: string }>;
    update?: HookSet<Partial<FormType>, T, { userId: string; id: string }>;
    delete?: HookSet<string, T, { userId: string; id: string }>;
    deleteAll?: HookSet<string, void, { userId: string }>;
    clear?: HookSet<string, void, { userId: string }>;
  };
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
) {
  const { table, kv, hooks = {} } = params;

  const getKvKey = (userId: string) => kv?.kvKeyFn(userId) ?? "";

  async function getAll(
    userId: string,
    options?: MethodOptions<string, T[], { userId: string }>
  ): Promise<T[]> {
    const context = { userId };
    const hookSet = mergeHooks(hooks.getAll, options?.hooks);
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
    const hookSet = mergeHooks(hooks.get, options?.hooks);
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
    const hookSet = mergeHooks(hooks.create, options?.hooks);
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
        await getAll(userId);
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
    const hookSet = mergeHooks(hooks.update, options?.hooks);
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
    const hookSet = mergeHooks(hooks.delete, options?.hooks);
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
  ) {
    const context = { userId };
    const hookSet = mergeHooks(hooks.deleteAll, options?.hooks); // Use the new deleteAll hook
    await hookSet.before?.({ input: userId, context });

    // @ts-expect-error — Drizzle doesn't expose column keys generically
    await db.delete(table).where(eq(table.userId, userId));

    await clear(userId);

    await hookSet.after?.({ input: userId, context });
  }

  async function clear(userId: string, options?: MethodOptions<string, void, { userId: string }>) {
    const context = { userId };
    const hookSet = mergeHooks(hooks.clear, options?.hooks);
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
    clear
  };
}
