import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { MessageRole } from "$lib/shared/types";

import { chatTable } from "./chat";
import { timestamps } from "./utils";

export const messageTable = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),

  chatId: uuid("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  role: text("role").$type<MessageRole>().notNull(),

  ...timestamps
});
