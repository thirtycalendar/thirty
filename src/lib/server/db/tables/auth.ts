import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { timestamps } from "./utils";

export const userTable = sqliteTable("users", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),

  ...timestamps
});

export const sessionTable = sqliteTable("sessions", {
  id: text("id").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  token: text("token").notNull().unique(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  ...timestamps
});

export const accountTable = sqliteTable("accounts", {
  id: text("id").primaryKey(),

  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp"
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp"
  }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),

  ...timestamps
});

export const verificationTable = sqliteTable("verifications", {
  id: text("id").primaryKey(),

  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),

  ...timestamps
});
