import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import { hc } from "hono/client";

import type { AppType } from "$lib/server/api";
import type { auth } from "$lib/server/auth";

export const client = hc<AppType>("");

export const serverClient = (fetch: Window["fetch"]) => {
  const client = hc<AppType>("", { fetch });

  return client;
};

export const authClient = createAuthClient({ plugins: [inferAdditionalFields<typeof auth>()] });
