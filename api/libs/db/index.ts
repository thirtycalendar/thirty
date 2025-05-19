import { drizzle as DrizzleDev } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as DrizzleProd } from "drizzle-orm/neon-http";

import { DB_URL_DEV, DB_URL_PROD, NODE_ENV } from "../env";

const isProd = NODE_ENV === "production";

const client = neon(DB_URL_PROD);

export const db = isProd ? DrizzleProd({ client }) : DrizzleDev(DB_URL_DEV);
