import { Redis } from "@upstash/redis";

import { kvEnvConfig } from "$lib/utils/env-configs";

export const kv = new Redis({
  url: kvEnvConfig.url,
  token: kvEnvConfig.token
});
