import { pgTable, serial, text } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { timestamps } from "./utils";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  ...timestamps
});
