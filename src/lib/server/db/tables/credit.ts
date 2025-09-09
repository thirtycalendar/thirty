import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { SubscriptionPlan } from "$lib/shared/types";

import { timestamps } from "./utils";

import { userTable } from ".";

export const creditTable = sqliteTable("credits", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade", onUpdate: "cascade" }),

  plan: text("plan").$type<SubscriptionPlan>().default("free").notNull(),
  remaining: integer("remaining").default(0).notNull(),
  month: text("month").notNull(),

  ...timestamps
});
