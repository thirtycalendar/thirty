import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "./utils";

import { userTable } from ".";

export const chatTable = sqliteTable("chats", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text("name").notNull(),

  ...timestamps
});
