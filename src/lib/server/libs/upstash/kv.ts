import { Redis } from "@upstash/redis";

import { kvEnvConfig, kvHolidayEnvConfig } from "$lib/server/utils/env-config";

export const kv = new Redis({
  url: kvEnvConfig.url,
  token: kvEnvConfig.token
});

export const kvHoliday = new Redis({
  url: kvHolidayEnvConfig.url,
  token: kvHolidayEnvConfig.token
});
