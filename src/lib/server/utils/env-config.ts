import { env } from "$env/dynamic/private";

import { googleScopes } from "$lib/server/auth/scopes";

import { isProd } from "$lib/shared/utils/is-prod";

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

export const kvWishlistEnvConfig = {
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
  server: isProd ? "production" : "sandbox",
  token: isProd ? env.POLAR_ACCESS_TOKEN_PROD : env.POLAR_ACCESS_TOKEN_DEV,
  webhookSecret: isProd ? env.POLAR_WEBHOOK_SECRET_PROD : env.POLAR_WEBHOOK_SECRET_DEV
} as const;

export const openAiEnvConfig = {
  apiKey: env.OPENAI_API_KEY
} as const;

export const openRouterEnvConfig = {
  apiKey: env.OPENROUTER_API_KEY
} as const;

export const voyageAiEnvConfig = {
  apiKey: env.VOYAGEAI_API_KEY
} as const;
