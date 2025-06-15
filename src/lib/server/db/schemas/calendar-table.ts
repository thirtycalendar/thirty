import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { Source } from "$lib/types/server";

import { user } from "./auth-table";
import { timestamps } from "./utils";

export const calendars = pgTable("calendars", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local"),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  colorId: text("colorId").notNull(),
  timezone: text("timezone").notNull(),
  isPrimary: boolean("is_primary").default(false),
  isSynced: boolean("is_synced").default(true),

  ...timestamps
});
