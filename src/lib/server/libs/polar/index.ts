import { Polar } from "@polar-sh/sdk";

import { polarEnvConfig } from "$lib/shared/utils/env-configs";

export const polar = new Polar({
  accessToken: polarEnvConfig.token,
  server: polarEnvConfig.server
});
