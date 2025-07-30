import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { MessageRole } from "$lib/shared/types";

import { chatTable } from "./chat";

export const messageTable = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  role: text("role").$type<MessageRole>().notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow()
});
