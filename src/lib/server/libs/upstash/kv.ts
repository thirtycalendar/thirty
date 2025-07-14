import { Redis } from "@upstash/redis";

import { kvEnvConfig, kvHolidayEnvConfig } from "$lib/shared/utils/env-configs";

export const kv = new Redis({
  url: kvEnvConfig.url,
  token: kvEnvConfig.token
});

export const kvHoliday = new Redis({
  url: kvHolidayEnvConfig.url,
  token: kvHolidayEnvConfig.token
});
