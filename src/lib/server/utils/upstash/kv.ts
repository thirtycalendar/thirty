import {
  UPSTASH_REDIS_REST_TOKEN_DEV,
  UPSTASH_REDIS_REST_TOKEN_PROD,
  UPSTASH_REDIS_REST_URL_DEV,
  UPSTASH_REDIS_REST_URL_PROD
} from "$env/static/private";

import { Redis } from "@upstash/redis";

import { isProd } from "$lib/utils/is-prod";

export const kv = new Redis({
  url: isProd ? UPSTASH_REDIS_REST_URL_PROD : UPSTASH_REDIS_REST_URL_DEV,
  token: isProd ? UPSTASH_REDIS_REST_TOKEN_PROD : UPSTASH_REDIS_REST_TOKEN_DEV
});
