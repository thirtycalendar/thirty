import { env } from "$env/dynamic/private";

import { googleScopes } from "../auth/scopes";

// Google
export const googleEnvConfig = {
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  scopes: googleScopes
} as const;

// Database
export const dbEnvConfig = {
  url: env.DB_URL,
  authToken: env.DB_AUTH_TOKEN
} as const;

// Upstash (Redis)
export const kvEnvConfig = {
  url: env.KV_URL,
  token: env.KV_TOKEN
} as const;

export const kvHolidayEnvConfig = {
  url: env.KV_URL_HOLIDAY,
  token: env.KV_TOKEN_HOLIDAY
} as const;

export const kvWaitingListEnvConfig = {
  url: env.KV_URL_WAITING_LIST,
  token: env.KV_TOKEN_WAITING_LIST
} as const;

// Vector (Redis)
export const vectorEnvConfig = {
  url: env.VECTOR_URL,
  token: env.VECTOR_TOKEN
} as const;

export const vectorHolidayEnvConfig = {
  url: env.VECTOR_URL_HOLIDAY,
  token: env.VECTOR_TOKEN_HOLIDAY
} as const;

// Polar
export const polarEnvConfig = {
  server: env.POLAR_SERVER, // "production" or "sandbox", set via .env
  token: env.POLAR_TOKEN,
  webhookSecret: env.POLAR_WEBHOOK_SECRET
} as const;

// OpenRouter
export const openRouterEnvConfig = {
  apiKey: env.OPENROUTER_API_KEY
} as const;

// Voyage
export const voyageAiEnvConfig = {
  apiKey: env.VOYAGEAI_API_KEY
} as const;
