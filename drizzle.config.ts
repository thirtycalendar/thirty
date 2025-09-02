import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";
const url = process.env.DB_URL!;
const authToken = process.env.DB_AUTH_TOKEN!;

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
