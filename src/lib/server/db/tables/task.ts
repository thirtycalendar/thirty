import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Color, Source, TaskStatus } from "$lib/shared/types";

import { notification, timestamps } from "./utils";

import { userTable } from ".";

export const taskTable = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),

  name: text("name").notNull(),
  notes: text("notes"),
  color: text("color").$type<Color>().default("#4986e7").notNull(),
  due: integer("due", { mode: "timestamp" }).notNull(),

  status: text("status").$type<TaskStatus>().default("pending").notNull(),

  ...notification,

  ...timestamps
});
