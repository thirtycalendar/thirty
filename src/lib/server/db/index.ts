import { DB_URL_DEV, DB_URL_PROD } from "$env/static/private";

import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/neon-http";

import { isProd } from "$lib/utils/is-prod";

const client = neon(isProd ? DB_URL_PROD : DB_URL_DEV);

export const db = drizzle({ client });
