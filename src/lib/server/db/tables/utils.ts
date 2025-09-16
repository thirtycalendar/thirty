import { boolean, integer, timestamp } from "drizzle-orm/pg-core";

import type { NotifyInDay, NotifyInMin } from "$lib/shared/types";

export const notification = {
  notifyInMin: integer("notifyInMin").$type<NotifyInMin>().default(0).notNull(),
  notificationSent: boolean("notificationSent").default(false).notNull()
};

export const birthdayNotification = {
  notifyInDay: integer("notifyInDay").$type<NotifyInDay>().default(1).notNull(),
  notificationSent: boolean("notificationSent").default(false).notNull()
};

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" })
};
