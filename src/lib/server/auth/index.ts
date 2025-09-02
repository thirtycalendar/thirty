import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";

import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "../db";
import { accountTable, sessionTable, userTable, verificationTable } from "../db/tables";
import { polarClient } from "../libs/polar/client";
import { creditService } from "../services";
import { googleScopes } from "./scopes";

export const auth = betterAuth({
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
      scope: googleScopes,
      accessType: "offline",
      prompt: "consent",
      overrideUserInfoOnSignIn: true
    }
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        portal(),
        checkout({
          products: [{ productId: publicEnv.PUBLIC_POLAR_PRODUCT_ID_PRO, slug: "pro" }],
          successUrl: "/calendar",
          authenticatedUsersOnly: true
        }),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (payload) => {
            const userId = payload.data.customer.externalId;

            const plan =
              payload.data.productId === publicEnv.PUBLIC_POLAR_PRODUCT_ID_PRO ? "pro" : "free";

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
