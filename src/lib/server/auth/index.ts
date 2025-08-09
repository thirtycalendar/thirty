import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins/generic-oauth";

import { polarClient } from "$lib/server/libs/polar/client";

import { getRandomColor } from "$lib/shared/utils/colors";
import { polarProductIdsEnvConfig } from "$lib/shared/utils/env-config";
import type { CalendarForm, CreditForm, GoogleSessionKV } from "$lib/shared/types";

import { storeGoogleSessionToKV } from "../calendars/google/token";
import { db } from "../db";
import { accountTable, sessionTable, userTable, verificationTable } from "../db/tables/auth";
import { cacheIPLocation, getIPLocation } from "../libs/ipwhois/utils";
import { calendarService } from "../services/calendar";
import { creditService } from "../services/credit";
import { holidayCountryService } from "../services/holiday";
import { googleEnvConfig, polarEnvConfig } from "../utils/env-config";

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
            color: getRandomColor(),
            timezone,
            isPrimary: true
          };

          await calendarService.create(id, calendar);

          const credit: CreditForm = {
            userId: id,
            month: new Date().toISOString()
          };

          await creditService.create(id, credit);

          await holidayCountryService.addCountryByCode(id, countryCode);
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
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        portal(),
        checkout({
          products: [{ productId: polarProductIdsEnvConfig.pro, slug: "pro" }],
          successUrl: "/calendar",
          authenticatedUsersOnly: true
        }),
        webhooks({
          secret: polarEnvConfig.webhookSecret,
          onOrderPaid: async (payload) => {
            const userId = payload.data.customer.externalId;

            const plan = payload.data.productId === polarProductIdsEnvConfig.pro ? "pro" : "free";

            if (userId) await creditService.update(userId, { plan });
          },
          onSubscriptionRevoked: async (payload) => {
            const userId = payload.data.customer.externalId;

            if (userId) await creditService.update(userId, { plan: "free" });
          }
        })
      ]
    })
  ]
});
