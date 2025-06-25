import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";

import type { CalendarForm } from "$lib/types";
import type { GoogleSession } from "$lib/types/server";
import { getRandomColorId } from "$lib/utils/colors";
import { googleEnvConfig } from "$lib/utils/env-configs";

import { storeGoogleSessionToKV } from "../calendars/google/token";
import { db } from "../db";
import { account, session, user, verification } from "../db/schemas/auth-table";
import { createCalendar } from "../services/calendar";

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
      update: {
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
    },
    user: {
      create: {
        after: async (user) => {
          const { id, name } = user;

          const calendar: CalendarForm = {
            externalId: null,
            source: "local",
            name,
            colorId: getRandomColorId(),
            timezone: "UTC",
            isPrimary: true
          };

          await createCalendar(id, calendar);
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
