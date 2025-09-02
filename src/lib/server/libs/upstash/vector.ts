import { env } from "$env/dynamic/private";

import { Index } from "@upstash/vector";

export const vector = new Index({
  url: env.VECTOR_URL,
  token: env.VECTOR_TOKEN
});

export const vectorHoliday = new Index({
  url: env.VECTOR_URL_HOLIDAY,
  token: env.VECTOR_TOKEN_HOLIDAY
});
