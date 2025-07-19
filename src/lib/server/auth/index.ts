import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";

import { getRandomColorId } from "$lib/shared/utils/colors";
import { googleEnvConfig } from "$lib/shared/utils/env-configs";
import type { CalendarForm, GoogleSessionKV } from "$lib/shared/types";

import { storeGoogleSessionToKV } from "../calendars/google/token";
import { db } from "../db";
import { accountTable, sessionTable, userTable, verificationTable } from "../db/tables/auth";
import { cacheIPLocation, getIPLocation } from "../libs/ipwhois/utils";
import { calendarService } from "../services/calendar";
import { addUserHolidayCountryByItsCode } from "../services/holiday";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable
    }
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
            const googleSession: GoogleSessionKV = {
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

          await cacheIPLocation(id);

          const { timezone, countryCode } = await getIPLocation(id);

          const calendar: CalendarForm = {
            externalId: null,
            source: "local",
            name,
            colorId: getRandomColorId(),
            timezone,
            isPrimary: true
          };

          await calendarService.create(id, calendar);

          await addUserHolidayCountryByItsCode(id, countryCode);
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
