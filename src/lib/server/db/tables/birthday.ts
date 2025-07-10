import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { userTable } from "./auth";
import { birthdayNotification, timestamps } from "./utils";

export const birthdayTable = pgTable("birthdays", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  dob: date("dob").notNull(),

  colorId: text("color_id").notNull(),
  note: text("note"),

  ...birthdayNotification,

  ...timestamps
});
