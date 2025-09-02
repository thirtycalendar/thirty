import { env } from "$env/dynamic/private";

import { auth, calendar } from "@googleapis/calendar";

import { getGoogleAccessToken } from "./token";

export async function getGoogleClients(userId: string) {
  const oAuthClient = new auth.OAuth2({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET
  });

  const accessToken = await getGoogleAccessToken(userId);
  oAuthClient.setCredentials({ access_token: accessToken });

  return {
    calendar: calendar({ version: "v3", auth: oAuthClient })
  };
}
