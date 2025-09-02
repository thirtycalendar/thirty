import { env } from "$env/dynamic/private";

import { createClient } from "@libsql/client";

import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: env.DB_URL,
  authToken: env.DB_AUTH_TOKEN
});

export const db = drizzle({ client });
