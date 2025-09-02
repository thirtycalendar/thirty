import { Redis } from "@upstash/redis";

import {
  kvEnvConfig,
  kvHolidayEnvConfig,
  kvWaitingListEnvConfig
} from "$lib/server/utils/env-config";

export const kvCacheTimes = {
  calendar: 60 * 60,
  event: 60 * 15,
  birthday: 60 * 60 * 24,
  task: 60 * 30,
  holiday: 60 * 60 * 24,
  chat: 60 * 15
} as const;

export const kv = new Redis({
  url: kvEnvConfig.url,
  token: kvEnvConfig.token
});

export const kvHoliday = new Redis({
  url: kvHolidayEnvConfig.url,
  token: kvHolidayEnvConfig.token
});

export const kvWaitingList = new Redis({
  url: kvWaitingListEnvConfig.url,
  token: kvWaitingListEnvConfig.token
});
