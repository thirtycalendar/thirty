import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

import type { Color } from "$lib/shared/types";

import { birthdayNotification, timestamps } from "./utils";

import { userTable } from ".";

export const birthdayTable = pgTable("birthdays", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  dob: date("dob").notNull(),

  color: text("color").$type<Color>().default("#4986e7").notNull(),
  note: text("note"),

  ...birthdayNotification,

  ...timestamps
});
