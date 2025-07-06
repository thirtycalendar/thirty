import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { chatTable } from "./chat";
import { timestamps, userSystemEnum } from "./utils";

export const messageTable = pgTable("messages", {
  id: serial("id").primaryKey(),

  chatId: integer("chat_id")
    .references(() => chatTable.id, { onDelete: "cascade" })
    .notNull(),

  content: text("content").notNull(),
  role: userSystemEnum("role").notNull(),

  ...timestamps
});
