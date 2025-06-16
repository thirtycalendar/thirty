import { boolean, integer, pgEnum, timestamp } from "drizzle-orm/pg-core";

import type { NotifyInMin } from "$lib/types";

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const notification = {
  notifyInMin: integer("notifyInMin").$type<NotifyInMin>().default(0).notNull(),
  notificationSent: boolean("notificationSent").default(false).notNull()
};

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" })
};
