import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { SubscriptionPlan } from "$lib/shared/types";

import { timestamps } from "./utils";

import { userTable } from ".";

export const creditTable = sqliteTable("credits", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  plan: text("plan").$type<SubscriptionPlan>().default("free").notNull(),
  count: integer("count").default(0).notNull(),
  month: integer("month", { mode: "timestamp" }).notNull(),

  ...timestamps
});
