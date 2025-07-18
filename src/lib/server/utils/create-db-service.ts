import type { Redis } from "@upstash/redis";

import { eq } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Hook<T> = (args: { input: any; result?: T }) => Promise<void> | void;

type CreateDbServiceParams<T extends { id: string; userId: string }> = {
  table: PgTable;
  kv?: {
    kv: Redis;
    kvKeyFn: (userId: string) => string;
    cacheTime: number;
  };
  hooks?: {
    getAll?: { before?: Hook<T[]>; after?: Hook<T[]> };
    get?: { before?: Hook<T>; after?: Hook<T> };
    create?: { before?: Hook<T>; after?: Hook<T> };
    update?: { before?: Hook<T>; after?: Hook<T> };
    delete?: { before?: Hook<T>; after?: Hook<T> };
    clear?: { before?: Hook<void>; after?: Hook<void> };
  };
};

export function createDbService<T extends { id: string; userId: string }, FormType>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  params: CreateDbServiceParams<T>
) {
  const { table, kv, hooks = {} } = params;

  const getKvKey = (userId: string) => kv?.kvKeyFn(userId) ?? "";

  async function getAll(userId: string): Promise<T[]> {
    await hooks.getAll?.before?.({ input: userId });

    if (kv) {
      const cached = await kv.kv.get<T[]>(getKvKey(userId));
      if (cached) return cached;
    }

    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const result = await db.select().from(table).where(eq(table.userId, userId));
    if (kv) await kv.kv.set(getKvKey(userId), result, { ex: kv.cacheTime });

    await hooks.getAll?.after?.({ input: userId, result });
    return result;
  }

  async function get(id: string): Promise<T> {
    await hooks.get?.before?.({ input: id });

    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!row) throw new Error("Not found");

    await hooks.get?.after?.({ input: id, result: row });
    return row;
  }

  async function create(userId: string, data: FormType): Promise<T> {
    await hooks.create?.before?.({ input: data });

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

    await hooks.create?.after?.({ input: data, result: inserted });
    return inserted;
  }

  async function update(id: string, updates: Partial<FormType>): Promise<T> {
    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [existing] = await db.select().from(table).where(eq(table.id, id)).limit(1);
    if (!existing) throw new Error("Not found");

    await hooks.update?.before?.({ input: updates });

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

    await hooks.update?.after?.({ input: updates, result: updated });
    return updated;
  }

  async function remove(id: string): Promise<T> {
    // @ts-expect-error — Drizzle doesn't expose column keys generically
    const [deleted] = await db.delete(table).where(eq(table.id, id)).returning();
    if (!deleted) throw new Error("Delete failed");

    await hooks.delete?.before?.({ input: id });

    if (kv) {
      const cached = await kv.kv.get<T[]>(getKvKey(deleted.userId));
      if (cached) {
        const filtered = cached.filter((i) => i.id !== id);
        await kv.kv.set(getKvKey(deleted.userId), filtered, { ex: kv.cacheTime });
      }
    }

    await hooks.delete?.after?.({ input: id, result: deleted });
    return deleted;
  }

  async function clear(userId: string) {
    await hooks.clear?.before?.({ input: userId });
    if (kv) await kv.kv.del(getKvKey(userId));
    await hooks.clear?.after?.({ input: userId });
  }

  return {
    getAll,
    get,
    create,
    update,
    delete: remove,
    clear
  };
}
