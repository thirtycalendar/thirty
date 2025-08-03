import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

import { dbEnvConfig } from "../utils/env-config";

const client = neon(dbEnvConfig.dbUrl);

export const db = drizzle({ client });
