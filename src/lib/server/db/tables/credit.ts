import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { timestamps } from "./utils";

export const creditTable = pgTable("credits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  month: text("month").notNull(), // e.g., "2025-08"
  used: integer("used").default(0).notNull(),
  limit: integer("limit").default(5000).notNull(),

  ...timestamps
});
