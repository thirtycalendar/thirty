import {
  DB_URL_DEV,
  DB_URL_PROD,
  GOOGLE_CLIENT_ID_DEV,
  GOOGLE_CLIENT_ID_PROD,
  GOOGLE_CLIENT_SECRET_DEV,
  GOOGLE_CLIENT_SECRET_PROD,
  OPENAI_API_KEY,
  UPSTASH_REDIS_REST_TOKEN_DEV,
  UPSTASH_REDIS_REST_TOKEN_HOLIDAY,
  UPSTASH_REDIS_REST_TOKEN_PROD,
  UPSTASH_REDIS_REST_URL_DEV,
  UPSTASH_REDIS_REST_URL_HOLIDAY,
  UPSTASH_REDIS_REST_URL_PROD,
  UPSTASH_VECTOR_REST_TOKEN,
  UPSTASH_VECTOR_REST_URL
} from "$env/static/private";

import { googleScopes } from "$lib/server/auth/scopes";

import { isProd } from "./is-prod";

export const openAiEnvConfig = {
  apiKey: OPENAI_API_KEY
};

export const dbEnvConfig = {
  dbUrl: isProd ? DB_URL_PROD : DB_URL_DEV
};

export const googleEnvConfig = {
  clientId: isProd ? GOOGLE_CLIENT_ID_PROD : GOOGLE_CLIENT_ID_DEV,
  clientSecret: isProd ? GOOGLE_CLIENT_SECRET_PROD : GOOGLE_CLIENT_SECRET_DEV,
  scopes: googleScopes
};

export const kvEnvConfig = {
  url: isProd ? UPSTASH_REDIS_REST_URL_PROD : UPSTASH_REDIS_REST_URL_DEV,
  token: isProd ? UPSTASH_REDIS_REST_TOKEN_PROD : UPSTASH_REDIS_REST_TOKEN_DEV
};

export const kvHolidayEnvConfig = {
  url: UPSTASH_REDIS_REST_URL_HOLIDAY,
  token: UPSTASH_REDIS_REST_TOKEN_HOLIDAY
};

export const vectorEnvConfig = {
  url: UPSTASH_VECTOR_REST_URL,
  token: UPSTASH_VECTOR_REST_TOKEN
};
