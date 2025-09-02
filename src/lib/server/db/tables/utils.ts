import { integer, text } from "drizzle-orm/sqlite-core";

import type { NotifyInDay, NotifyInMin } from "$lib/shared/types";

export const notification = {
  notifyInMin: integer("notifyInMin").$type<NotifyInMin>().default(0).notNull(),
  notificationSent: integer("notificationSent", { mode: "boolean" }).default(false).notNull()
};

export const birthdayNotification = {
  notifyInDay: integer("notifyInDay").$type<NotifyInDay>().default(1).notNull(),
  notificationSent: integer("notificationSent", { mode: "boolean" }).default(false).notNull()
};

export const timestamps = {
  createdAt: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  updatedAt: text("updated_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  deletedAt: text("deleted_at").notNull()
};
