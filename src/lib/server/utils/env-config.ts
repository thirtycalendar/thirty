import { env } from "$env/dynamic/private";

import { isProd } from "$lib/shared/utils/is-prod";

import { googleScopes } from "../auth/scopes";

export const googleEnvConfig = {
  clientId: isProd ? env.GOOGLE_CLIENT_ID_PROD : env.GOOGLE_CLIENT_ID_DEV,
  clientSecret: isProd ? env.GOOGLE_CLIENT_SECRET_PROD : env.GOOGLE_CLIENT_SECRET_DEV,
  scopes: googleScopes
} as const;

export const dbEnvConfig = {
  url: isProd ? env.DB_URL_PROD : env.DB_URL_DEV,
  authToken: isProd ? env.DB_AUTH_TOKEN_PROD : env.DB_AUTH_TOKEN_DEV
} as const;

export const kvEnvConfig = {
  url: isProd ? env.KV_URL_PROD : env.KV_URL_DEV,
  token: isProd ? env.KV_TOKEN_PROD : env.KV_TOKEN_DEV
} as const;
