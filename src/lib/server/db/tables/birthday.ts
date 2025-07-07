import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { birthdayNotification, timestamps } from "./utils";

export const birthdayTable = pgTable("birthdays", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  colorId: text("colorId").notNull(),
  description: text("description"),

  ...birthdayNotification,

  ...timestamps
});
