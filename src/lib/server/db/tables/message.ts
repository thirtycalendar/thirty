import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { MessageRole } from "$lib/shared/types";

import { timestamps } from "./utils";

import { chatTable } from ".";

export const messageTable = sqliteTable("messages", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  chatId: text("chat_id")
    .notNull()
    .references(() => chatTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

  text: text("text").notNull(),
  role: text("role").$type<MessageRole>().notNull(),

  ...timestamps
});
