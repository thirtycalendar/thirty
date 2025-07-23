import { Index } from "@upstash/vector";

import { vectorEnvConfig } from "$lib/shared/utils/env-configs";

export const vector = new Index({
  url: vectorEnvConfig.url,
  token: vectorEnvConfig.token
});
