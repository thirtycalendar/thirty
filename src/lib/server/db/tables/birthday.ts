import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { Color } from "$lib/shared/types";

import { birthdayNotification, timestamps } from "./utils";

import { userTable } from ".";

export const birthdayTable = sqliteTable("birthdays", {
  id: text("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  dob: integer("dob", { mode: "timestamp" }).notNull(),

  color: text("color").$type<Color>().default("#4986e7").notNull(),
  note: text("note"),

  ...birthdayNotification,

  ...timestamps
});
