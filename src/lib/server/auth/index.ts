import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

import type { GoogleSession } from "$lib/types/server";
import { googleEnvConfig } from "$lib/utils/env-configs";

import { storeGoogleSessionToKV } from "../calendars/google/token";
import { db } from "../db";
import { account, session, user, verification } from "../db/schemas/auth-table";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification }
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    freshAge: 60 * 60 * 24 * 1
  },
  databaseHooks: {
    account: {
      create: {
        after: async (session) => {
          const { userId, accessToken, refreshToken, accessTokenExpiresAt, idToken } = session;

          if (userId && accessToken && refreshToken && accessTokenExpiresAt && idToken) {
            const googleSession: GoogleSession = {
              userId,
              accessToken,
              refreshToken,
              accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
              idToken
            };

            await storeGoogleSessionToKV(googleSession);
          }
        }
      }
    }
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "google",
          clientId: googleEnvConfig.clientId,
          clientSecret: googleEnvConfig.clientSecret,
          scopes: googleEnvConfig.scopes,
          discoveryUrl: "https://accounts.google.com/.well-known/openid-configuration",
          accessType: "offline",
          prompt: "consent"
        }
      ]
    })
    //   polar({
    //     client: polarClient,
    //     createCustomerOnSignUp: true,
    //   }),
  ]
});
