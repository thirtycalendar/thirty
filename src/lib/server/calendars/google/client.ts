import { auth, calendar } from "@googleapis/calendar";
import { tasks } from "@googleapis/tasks";

import { googleEnvConfig } from "$lib/server/utils/env-config";

import { getGoogleAccessToken } from "./token";

export async function getGoogleClients(userId: string) {
  const oAuthClient = new auth.OAuth2({
    clientId: googleEnvConfig.clientId,
    clientSecret: googleEnvConfig.clientSecret
  });

  const accessToken = await getGoogleAccessToken(userId);
  oAuthClient.setCredentials({ access_token: accessToken });

  return {
    calendar: calendar({ version: "v3", auth: oAuthClient }),
    tasks: tasks({ version: "v1", auth: oAuthClient })
  };
}
