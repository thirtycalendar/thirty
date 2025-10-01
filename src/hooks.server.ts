import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { NODE_ENV } from "$env/static/private";

import { svelteKitHandler } from "better-auth/svelte-kit";

import { getAuth } from "$lib/server/auth";
import { getDb } from "$lib/server/db";

export const handle: Handle = async ({ event, resolve }) => {
  const db = NODE_ENV === "production" ? event.platform?.env?.DB_PROD : event.platform?.env?.DB_DEV;

  event.locals.db = getDb(db as D1Database);
  event.locals.auth = getAuth(event.locals.db);

  return svelteKitHandler({ event, resolve, auth: event.locals.auth, building });
};
