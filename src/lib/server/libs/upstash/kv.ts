import { Redis } from "@upstash/redis";

import {
  kvEnvConfig,
  kvHolidayEnvConfig,
  kvWaitingListEnvConfig
} from "$lib/server/utils/env-config";

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
