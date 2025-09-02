import { createClient } from "@libsql/client";

import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/libsql";

import { dbEnvConfig, kvEnvConfig } from "../utils/env-config";

const client = createClient({
  url: dbEnvConfig.url,
  authToken: dbEnvConfig.authToken
});

export const db = drizzle({
  client,
  cache: upstashCache({
    url: kvEnvConfig.url,
    token: kvEnvConfig.token,
    global: true,
    config: { ex: 60 }
  })
});
