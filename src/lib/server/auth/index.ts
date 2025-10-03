import { env } from "$env/dynamic/private";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { DbClient } from "$lib/shared/types";

import { accountTable, sessionTable, userTable, verificationTable } from "../db/tables";

export function getAuth(db: DbClient) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: userTable,
        session: sessionTable,
        account: accountTable,
        verification: verificationTable
      }
    }),
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        accessType: "offline",
        prompt: "consent",
        overrideUserInfoOnSignIn: true
      }
    }
  });
}
