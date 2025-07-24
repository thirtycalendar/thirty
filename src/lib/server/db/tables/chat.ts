import { pgTable, serial, text } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { timestamps } from "./utils";

export const chatTable = pgTable("chats", {
  id: serial("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  ...timestamps
});
