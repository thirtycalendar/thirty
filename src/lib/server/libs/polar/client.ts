import { Polar } from "@polar-sh/sdk";

import { polarEnvConfig } from "$lib/server/utils/env-config";

export const polarClient = new Polar({
  accessToken: polarEnvConfig.token,
  server: polarEnvConfig.server
});
