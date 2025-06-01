import { auth, calendar } from "@googleapis/calendar";

import { googleEnvConfig } from "$lib/utils/env-configs";

import { getGoogleAccessToken } from "./token";

export async function googleCalClient(userId: string) {
  const oAuthClient = new auth.OAuth2({
    clientId: googleEnvConfig.clientId,
    clientSecret: googleEnvConfig.clientSecret
  });

  const accessToken = await getGoogleAccessToken(userId);
  oAuthClient.setCredentials({ access_token: accessToken });

  return calendar({ version: "v3", auth: oAuthClient });
}
