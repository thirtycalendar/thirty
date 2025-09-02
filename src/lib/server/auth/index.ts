import { checkout, polar, portal, webhooks } from "@polar-sh/better-auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { polarProductIdsEnvConfig } from "$lib/shared/utils/env-config";

import { db } from "../db";
import { accountTable, sessionTable, userTable, verificationTable } from "../db/tables";
import { polarClient } from "../libs/polar/client";
import { creditService } from "../services";
import { polarEnvConfig } from "../utils/env-config";

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
  plugins: [
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
