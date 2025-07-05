import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

import { dbEnvConfig } from "$lib/shared/utils/env-configs";

const client = neon(dbEnvConfig.dbUrl);

export const db = drizzle({ client });
