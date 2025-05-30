import {
  GOOGLE_CLIENT_ID_DEV,
  GOOGLE_CLIENT_ID_PROD,
  GOOGLE_CLIENT_SECRET_DEV,
  GOOGLE_CLIENT_SECRET_PROD
} from "$env/static/private";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { isProd } from "$lib/utils/is-prod";

import { db } from "../db";
import { account, session, user, verification } from "../db/schemas/auth-table";
import { googleScopes } from "./scopes/google";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: isProd ? GOOGLE_CLIENT_ID_PROD : GOOGLE_CLIENT_ID_DEV,
      clientSecret: isProd ? GOOGLE_CLIENT_SECRET_PROD : GOOGLE_CLIENT_SECRET_DEV,
      scope: googleScopes
    }
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification }
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    freshAge: 60 * 60 * 24 * 1
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          console.log("session:", session);
        }
      }
    }
  }
  // plugins: [
  //   polar({
  //     client: polarClient,
  //     createCustomerOnSignUp: true,
  //   }),
  // ],
});
