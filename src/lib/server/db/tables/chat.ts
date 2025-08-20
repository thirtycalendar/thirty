import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { timestamps, userTable } from ".";

export const chatTable = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  ...timestamps
});
