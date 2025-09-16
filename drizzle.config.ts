import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const isProd = process.env.NODE_ENV === "production";
const url = process.env.DB_URL!;

export default defineConfig({
  out: `.drizzle/migrations-${isProd ? "prod" : "dev"}`,
  schema: "./src/lib/server/db/tables/*",
  dialect: "postgresql",
  dbCredentials: { url },
  verbose: true,
  strict: true
});
