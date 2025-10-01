import { NODE_ENV } from "$env/static/private";

import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

const isProd = NODE_ENV === "production";

export const db = drizzle(isProd ? env.DB_PROD : env.DB_DEV);
