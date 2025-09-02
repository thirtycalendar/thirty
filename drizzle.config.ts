import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";

const url = isProd ? process.env.DB_URL_PROD! : process.env.DB_URL_DEV!;
const authToken = isProd ? process.env.DB_AUTH_TOKEN_PROD! : process.env.DB_AUTH_TOKEN_DEV!;

export default defineConfig({
  out: `.drizzle/migrations-${isProd ? "prod" : "dev"}`,
  schema: "./src/lib/server/db/tables/*",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken
  },
  verbose: true,
  strict: true
});
