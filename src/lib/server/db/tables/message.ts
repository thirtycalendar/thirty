import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { MessageRole } from "$lib/shared/types";

import { timestamps } from "./utils";

import { chatTable } from ".";

export const messageTable = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),

  text: text("text").notNull(),
  role: text("role").$type<MessageRole>().notNull(),

  ...timestamps
});
