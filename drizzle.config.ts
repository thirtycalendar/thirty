import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";

const accountId = process.env.CF_ACC_ID!;
const databaseId = process.env.DB_ID!;
const token = process.env.DB_TOKEN!;

export default defineConfig({
  out: `.drizzle/migrations-${isProd ? "prod" : "dev"}`,
  schema: "./src/lib/server/db/tables/*",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: { accountId, databaseId, token }
});
