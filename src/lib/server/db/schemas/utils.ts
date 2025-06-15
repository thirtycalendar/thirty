import { boolean, pgEnum, timestamp } from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const notificationSent = {
  notificationSent: boolean("notificationSent").default(false)
};

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" })
};
