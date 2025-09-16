import { DB_URL } from "$env/static/private";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: DB_URL,
  max: 50,
  idleTimeoutMillis: 30000
});

export const db = drizzle({ client: pool });
