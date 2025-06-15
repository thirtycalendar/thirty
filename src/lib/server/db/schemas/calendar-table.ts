import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { Source } from "$lib/types/server";

import { user } from "./auth-table";
import { timestamps } from "./utils";

export const calendars = pgTable("calendars", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  externalId: text("external_id"),
  source: text("source").$type<Source>().default("local"),
  name: text("name").notNull(),
  colorId: text("colorId"),
  timezone: text("timezone").notNull(),
  isPrimary: boolean("is_primary").default(false),
  isSynced: boolean("is_synced").default(true),

  ...timestamps
});
