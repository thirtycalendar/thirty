import {
  GOOGLE_CLIENT_ID_DEV,
  GOOGLE_CLIENT_ID_PROD,
  GOOGLE_CLIENT_SECRET_DEV,
  GOOGLE_CLIENT_SECRET_PROD
} from "$env/static/private";

import { auth, calendar } from "@googleapis/calendar";

import { googleScopes } from "$lib/server/auth/scopes/google";

import { isProd } from "$lib/utils/is-prod";

import { getGoogleAccessToken } from "./token";

export const googleAuthConfig = {
  clientId: isProd ? GOOGLE_CLIENT_ID_PROD : GOOGLE_CLIENT_ID_DEV,
  clientSecret: isProd ? GOOGLE_CLIENT_SECRET_PROD : GOOGLE_CLIENT_SECRET_DEV,
  scope: googleScopes
};

export async function googleCalClient(userId: string) {
  const oAuthClient = new auth.OAuth2({
    clientId: googleAuthConfig.clientId,
    clientSecret: googleAuthConfig.clientSecret
  });

  const accessToken = await getGoogleAccessToken(userId);
  oAuthClient.setCredentials({ access_token: accessToken });

  return calendar({ version: "v3", auth: oAuthClient });
}
