import { getAuth } from "$lib/server/auth";
import { getDb } from "$lib/server/db";

export type DbClient = ReturnType<typeof getDb>;
export type AuthClient = ReturnType<typeof getAuth>;
