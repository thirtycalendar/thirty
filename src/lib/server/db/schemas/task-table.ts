import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth-table";
import { timestamps } from "./utils";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  title: text("title").notNull(),
  notes: text("notes"),
  due: timestamp("due"),
  status: text("status").$type<"pending" | "completed">().default("pending"),
  source: text("source").$type<"local" | "google">().default("local"),

  ...timestamps
});
