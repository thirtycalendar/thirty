import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { Color, Source } from "$lib/shared/types";

import { timestamps } from "./utils";

import { userTable } from ".";

export const calendarTable = pgTable("calendars", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local").notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  color: text("color").$type<Color>().default("#4986e7").notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  isSynced: boolean("is_synced").default(true).notNull(),

  ...timestamps
});
