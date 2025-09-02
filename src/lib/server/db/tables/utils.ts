import { integer } from "drizzle-orm/sqlite-core";

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
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  deletedAt: integer("deleted_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull()
};
