import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { chats } from "./chat";
import { timestamps, userSystemEnum } from "./utils";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),

  chatId: integer("chat_id")
    .references(() => chats.id, { onDelete: "cascade" })
    .notNull(),

  content: text("content").notNull(),
  role: userSystemEnum("role").notNull(),

  ...timestamps
});
