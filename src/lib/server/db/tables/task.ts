import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Source, TaskStatus } from "$lib/shared/types";

import { notification, timestamps } from "./utils";

import { userTable } from ".";

export const taskTable = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),

  name: text("name").notNull(),
  notes: text("notes"),
  colorId: text("color_id").notNull(),
  due: integer("due", { mode: "timestamp" }).notNull(),

  status: text("status").$type<TaskStatus>().default("pending").notNull(),

  ...notification,

  ...timestamps
});
