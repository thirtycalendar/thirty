import { polarClient } from "@polar-sh/better-auth";

import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";
import { hc } from "hono/client";

import type { AppType } from "$lib/server/api";

export const client = hc<AppType>("");

export const serverClient = (fetch: Window["fetch"]) => {
  const client = hc<AppType>("", { fetch });

  return client;
};

export const authClient = createAuthClient({ plugins: [genericOAuthClient(), polarClient()] });
