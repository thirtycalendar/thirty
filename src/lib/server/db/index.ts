import { drizzle } from "drizzle-orm/d1";

export function getDb(db: D1Database) {
  return drizzle(db);
}
