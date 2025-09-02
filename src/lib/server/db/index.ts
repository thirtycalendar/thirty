import { createClient } from "@libsql/client";

import { drizzle } from "drizzle-orm/libsql";

import { dbEnvConfig } from "../utils/env-config";

const client = createClient({
  url: dbEnvConfig.url,
  authToken: dbEnvConfig.authToken
});

export const db = drizzle({ client });
