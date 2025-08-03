import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";

import { googleScopes } from "$lib/server/auth/scopes";

import { isProd } from "./is-prod";

export const openAiEnvConfig = {
  apiKey: env.OPENAI_API_KEY
} as const;

export const dbEnvConfig = {
  dbUrl: isProd ? env.DB_URL_PROD : env.DB_URL_DEV
} as const;

export const googleEnvConfig = {
  clientId: isProd ? env.GOOGLE_CLIENT_ID_PROD : env.GOOGLE_CLIENT_ID_DEV,
  clientSecret: isProd ? env.GOOGLE_CLIENT_SECRET_PROD : env.GOOGLE_CLIENT_SECRET_DEV,
  scopes: googleScopes
} as const;

export const kvEnvConfig = {
  url: isProd ? env.UPSTASH_REDIS_REST_URL_PROD : env.UPSTASH_REDIS_REST_URL_DEV,
  token: isProd ? env.UPSTASH_REDIS_REST_TOKEN_PROD : env.UPSTASH_REDIS_REST_TOKEN_DEV
} as const;

export const kvHolidayEnvConfig = {
  url: env.UPSTASH_REDIS_REST_URL_HOLIDAY,
  token: env.UPSTASH_REDIS_REST_TOKEN_HOLIDAY
} as const;

export const vectorEnvConfig = {
  url: isProd ? env.UPSTASH_VECTOR_REST_URL_PROD : env.UPSTASH_VECTOR_REST_URL_DEV,
  token: isProd ? env.UPSTASH_VECTOR_REST_TOKEN_PROD : env.UPSTASH_VECTOR_REST_TOKEN_DEV
} as const;

export const vectorHolidayEnvConfig = {
  url: env.UPSTASH_VECTOR_REST_URL_HOLIDAY,
  token: env.UPSTASH_VECTOR_REST_TOKEN_HOLIDAY
} as const;

export const polarEnvConfig = {
  token: isProd ? env.POLAR_ACCESS_TOKEN_PROD : env.POLAR_ACCESS_TOKEN_DEV,
  server: isProd ? "production" : "sandbox"
} as const;

export const polarProductIdsEnvConfig = {
  pro: isProd ? publicEnv.PUBLIC_PRO_PRODUCT_ID_PROD : publicEnv.PUBLIC_PRO_PRODUCT_ID_DEV
} as const;
