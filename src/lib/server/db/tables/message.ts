import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { MessageRole } from "$lib/shared/types";

import { chatTable } from ".";

export const messageTable = sqliteTable("messages", {
  id: text("id").primaryKey(),

  chatId: text("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  role: text("role").$type<MessageRole>().notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull()
});
