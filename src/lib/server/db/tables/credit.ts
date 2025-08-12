import { date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { SubscriptionPlan } from "$lib/shared/types";

import { userTable } from "./auth";
import { timestamps } from "./utils";

export const creditTable = pgTable("credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  plan: text("plan").$type<SubscriptionPlan>().default("free").notNull(),
  count: integer("count").default(0).notNull(),
  month: date("month").notNull(),

  ...timestamps
});
