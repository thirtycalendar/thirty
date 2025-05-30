import {
  GOOGLE_CLIENT_DEV_ID,
  GOOGLE_CLIENT_DEV_SECRET,
  GOOGLE_CLIENT_PROD_ID,
  GOOGLE_CLIENT_PROD_SECRET,
  NODE_ENV
} from "$env/static/private";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db";
import { account, session, user, verification } from "../db/schemas/auth-table";
import { googleScopes } from "./scopes/google";

const isProd = NODE_ENV === "production";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: isProd ? GOOGLE_CLIENT_PROD_ID : GOOGLE_CLIENT_DEV_ID,
      clientSecret: isProd ? GOOGLE_CLIENT_PROD_SECRET : GOOGLE_CLIENT_DEV_SECRET,
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
  }
  // plugins: [
  //   polar({
  //     client: polarClient,
  //     createCustomerOnSignUp: true,
  //   }),
  // ],
});
