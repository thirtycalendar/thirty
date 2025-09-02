/*
 * To keep migrations: --keep-migrations
 *
 * For Dev
 * pnpm dlx dotenv-cli -e .env -- pnpm dlx tsx ./src/lib/server/utils/scripts/reset-db.ts
 *
 * For Prod
 * pnpm dlx dotenv-cli -e .env.prod -- pnpm dlx tsx ./src/lib/server/utils/scripts/reset-db.ts
 */

import "dotenv/config";

import { createClient } from "@libsql/client";

import { drizzle } from "drizzle-orm/libsql";

const args = process.argv;
const keepMigrations = args.includes("--keep-migrations");

const url = process.env.DB_URL!;
const authToken = process.env.DB_AUTH_TOKEN!;

const client = createClient({ url, authToken });
const db = drizzle({ client });

async function resetDb(): Promise<void> {
  const tables = await db.run(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
  );

  for (const row of tables.rows) {
    const tableName = row.name as string;
    if (keepMigrations && tableName === "__drizzle_migrations") continue;
    await db.run(`DROP TABLE IF EXISTS "${tableName}"`);
  }

  console.log("✅ Turso DB reset completed.");
}

resetDb().catch((err) => {
  console.error("❌ Error resetting DB:", err);
  process.exit(1);
});
