import { eq } from "drizzle-orm";

import { db } from "$lib/server/db";

import type { Message, MessageForm } from "$lib/shared/types";

import { messageTable } from "../db/tables/message";

export class MessageNotFoundError extends Error {
  constructor(id: string) {
    super(`Message with id '${id}' not found`);
    this.name = "MessageNotFoundError";
  }
}

export const messageService = {
  async get(id: string): Promise<Message> {
    const [msg] = await db.select().from(messageTable).where(eq(messageTable.id, id)).limit(1);
    if (!msg) throw new MessageNotFoundError(id);
    return msg;
  },

  async getAll(chatId: string): Promise<Message[]> {
    return db.select().from(messageTable).where(eq(messageTable.chatId, chatId));
  },

  async create(data: MessageForm): Promise<Message> {
    const [row] = await db.insert(messageTable).values(data).returning();
    return row;
  },

  async update(id: string, updates: Partial<MessageForm>): Promise<Message> {
    const [existing] = await db.select().from(messageTable).where(eq(messageTable.id, id)).limit(1);
    if (!existing) throw new MessageNotFoundError(id);

    const [updated] = await db
      .update(messageTable)
      .set(updates)
      .where(eq(messageTable.id, id))
      .returning();

    if (!updated) throw new MessageNotFoundError(id);

    return updated;
  },

  async delete(id: string): Promise<Message> {
    const [msg] = await db.select().from(messageTable).where(eq(messageTable.id, id)).limit(1);
    if (!msg) throw new MessageNotFoundError(id);

    await db.delete(messageTable).where(eq(messageTable.id, id));
    return msg;
  }
};
