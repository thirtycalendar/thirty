import { Index } from "@upstash/vector";

import { vectorEnvConfig, vectorHolidayEnvConfig } from "$lib/server/utils/env-config";

export const vector = new Index({
  url: vectorEnvConfig.url,
  token: vectorEnvConfig.token
});

export const vectorHoliday = new Index({
  url: vectorHolidayEnvConfig.url,
  token: vectorHolidayEnvConfig.token
});
