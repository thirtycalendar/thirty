import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  out: `.drizzle/migrations-${isProd ? "prod" : "dev"}`,
  schema: "./src/lib/server/db/tables/*",
  dialect: "postgresql",
  dbCredentials: {
    url: isProd ? (process.env.DB_URL_PROD as string) : (process.env.DB_URL_DEV as string)
  },
  verbose: true,
  strict: true
});
