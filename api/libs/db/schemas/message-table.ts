import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { timestamps, userSystemEnum } from "./utils";
import { chats } from "./chat-table";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  role: userSystemEnum("role").notNull(),

  ...timestamps
});
