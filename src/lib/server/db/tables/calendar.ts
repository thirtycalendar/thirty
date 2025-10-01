import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Color, Source } from "$lib/shared/types";

import { timestamps } from "./utils";

import { userTable } from ".";

export const calendarTable = sqliteTable("calendars", {
  id: text("id").primaryKey(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  color: text("color").$type<Color>().default("#4986e7").notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false).notNull(),
  isSynced: integer("is_synced", { mode: "boolean" }).default(true).notNull(),

  ...timestamps
});
