import { env } from "$env/dynamic/private";

import { Redis } from "@upstash/redis";

import { toMs } from "$lib/shared/utils/ms";

export const kvCacheTimes = {
  calendar: toMs("1hs"),
  event: toMs("15m"),
  task: toMs("30m"),
  birthday: toMs("1d"),
  holiday: toMs("1d"),
  chat: toMs("15m")
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
