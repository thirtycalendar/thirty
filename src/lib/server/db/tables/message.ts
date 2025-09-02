import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { MessageRole } from "$lib/shared/types";

import { chatTable } from ".";

export const messageTable = sqliteTable("messages", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  chatId: text("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  role: text("role").$type<MessageRole>().notNull(),

  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull()
});
