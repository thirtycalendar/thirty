import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { timestamps } from "./utils";

export const chatTable = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  ...timestamps
});
