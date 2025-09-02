import { isProd } from "../../shared/utils/is-prod.ts";

export const dbEnvConfig = {
  url: isProd ? Deno.env.get("DB_URL_PROD")! : Deno.env.get("DB_URL_DEV")!,
  authToken: isProd ? Deno.env.get("DB_AUTH_TOKEN_PROD")! : Deno.env.get("DB_AUTH_TOKEN_DEV")!
} as const;
