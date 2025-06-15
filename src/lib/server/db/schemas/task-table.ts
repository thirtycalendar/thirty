import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Source, TaskStatus } from "$lib/types/server";

import { user } from "./auth-table";
import { notificationSent, timestamps } from "./utils";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id),

  title: text("title").notNull(),
  notes: text("notes"),
  colorId: text("colorId").notNull(),
  due: timestamp("due", { withTimezone: true, mode: "string" }).notNull(),
  status: text("status").$type<TaskStatus>().default("pending"),

  ...notificationSent,

  ...timestamps
});
