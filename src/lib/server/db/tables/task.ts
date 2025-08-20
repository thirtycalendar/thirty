import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import type { Source, TaskStatus } from "$lib/shared/types";

import { notification, timestamps } from "./utils";

import { userTable } from ".";

export const taskTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),

  name: text("name").notNull(),
  notes: text("notes"),
  colorId: text("color_id").notNull(),
  due: timestamp("due", { withTimezone: true, mode: "string" }).notNull(),
  status: text("status").$type<TaskStatus>().default("pending").notNull(),

  ...notification,

  ...timestamps
});
