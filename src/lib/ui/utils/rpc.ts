import { createAuthClient } from "better-auth/svelte";
import { hc } from "hono/client";

import type { AppType } from "$lib/server/api";

export const client = hc<AppType>("");

export const serverClient = (fetch: Window["fetch"]) => {
  const client = hc<AppType>("", { fetch });

  return client;
};

export const authClient = createAuthClient();
