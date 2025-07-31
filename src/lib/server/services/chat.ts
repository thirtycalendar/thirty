import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";

import { chatTable } from "../db/tables/chat";

export class ChatNotFoundError extends Error {
  constructor(id: string) {
    super(`Chat with id '${id}' not found`);
    this.name = "ChatNotFoundError";
  }
}

type Chat = typeof chatTable.$inferSelect;
type ChatInsert = typeof chatTable.$inferInsert;

export const chatService = {
  async maybeGet(id: string): Promise<Chat | null> {
    const [chat] = await db.select().from(chatTable).where(eq(chatTable.id, id)).limit(1);
    return chat ?? null;
  },

  async get(id: string): Promise<Chat> {
    const [chat] = await db.select().from(chatTable).where(eq(chatTable.id, id)).limit(1);
    if (!chat) throw new ChatNotFoundError(id);
    return chat;
  },

  async getAll(userId: string): Promise<Chat[]> {
    return db.select().from(chatTable).where(eq(chatTable.userId, userId));
  },

  async create(data: ChatInsert): Promise<Chat> {
    const [row] = await db.insert(chatTable).values(data).returning();
    return row;
  },

  async update(id: string, updates: Partial<ChatInsert>): Promise<Chat> {
    const [existing] = await db
      .select({ userId: chatTable.userId })
      .from(chatTable)
      .where(eq(chatTable.id, id))
      .limit(1);
    if (!existing) throw new ChatNotFoundError(id);

    const [updated] = await db
      .update(chatTable)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(chatTable.id, id))
      .returning();
    if (!updated) throw new ChatNotFoundError(id);
    return updated;
  },

  async delete(id: string): Promise<Chat> {
    const [chat] = await db.select().from(chatTable).where(eq(chatTable.id, id)).limit(1);
    if (!chat) throw new ChatNotFoundError(id);

    await db.delete(chatTable).where(eq(chatTable.id, id));
    return chat;
  }
};
