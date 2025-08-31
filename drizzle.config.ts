import { defineConfig } from "drizzle-kit";

const isProd = Deno.env.get("PUBLIC_IS_PROD") === "true";

const url = isProd ? Deno.env.get("DB_URL_PROD")! : Deno.env.get("DB_URL_DEV")!;
const authToken = isProd
  ? Deno.env.get("DB_AUTH_TOKEN_PROD")!
  : Deno.env.get("DB_AUTH_TOKEN_DEV")!;

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
