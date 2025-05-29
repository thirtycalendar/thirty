import { DB_URL_DEV, DB_URL_PROD, NODE_ENV } from "$env/static/private";

import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

const isProd = NODE_ENV === "production";

const client = neon(isProd ? DB_URL_PROD : DB_URL_DEV);

export const db = drizzle({ client });
