import { sql } from "drizzle-orm";
import { text } from "drizzle-orm/sqlite-core";

export const timestamps = {
  createdAt: text("created_at")
    .default(sql`(current_timestamp)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(current_timestamp)`)
    .notNull(),
  deletedAt: text("deleted_at")
    .default(sql`(current_timestamp)`)
    .notNull()
};
