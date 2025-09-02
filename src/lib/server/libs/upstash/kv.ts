import { env } from "$env/dynamic/private";

import { Redis } from "@upstash/redis";

export const kvCacheTimes = {
  calendar: 60 * 60,
  event: 60 * 15,
  birthday: 60 * 60 * 24,
  task: 60 * 30,
  holiday: 60 * 60 * 24,
  chat: 60 * 15
} as const;

export const kv = new Redis({
  url: env.KV_URL,
  token: env.KV_TOKEN
});

export const kvHoliday = new Redis({
  url: env.KV_URL_HOLIDAY,
  token: env.KV_TOKEN_HOLIDAY
});

export const kvWaitingList = new Redis({
  url: env.KV_URL_WAITING_LIST,
  token: env.KV_TOKEN_WAITING_LIST
});
