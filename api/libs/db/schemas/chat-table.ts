import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "./utils";

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),

  ...timestamps,
});
