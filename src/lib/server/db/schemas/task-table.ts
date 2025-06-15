import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Source, TaskStatus } from "$lib/types/server";

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
  status: text("status").$type<TaskStatus>().default("pending"),
  source: text("source").$type<Source>().default("local"),

  ...timestamps
});
