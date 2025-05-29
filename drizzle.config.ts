import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  out: `./src/lib/server/db/migrations-${isProd ? "prod" : "dev"}`,
  schema: "./src/lib/server/db/schemas/*",
  dialect: "postgresql",
  dbCredentials: {
    url: isProd ? (process.env.DB_URL_PROD as string) : (process.env.DB_URL_DEV as string)
  },
  verbose: true,
  strict: true
});
