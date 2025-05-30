import { GOOGLE_CLIENT_ID_DEV, GOOGLE_CLIENT_SECRET_DEV } from "$env/static/private";

import { google } from "googleapis";
import type { Context } from "hono";

import { auth } from "$lib/server/auth";

import type { User } from "$lib/types";

export async function getOAuthClient(c: Context) {
  const user = c.get("user") as User;
  const userId = user.id;

  const session = await auth.api.getAccessToken({
    body: { providerId: "google", userId },
    headers: c.req.raw.headers
  });

  if (!session.accessToken) {
    throw new Error("Unauthorized");
  }

  const client = new google.auth.OAuth2({
    clientId: GOOGLE_CLIENT_ID_DEV,
    clientSecret: GOOGLE_CLIENT_SECRET_DEV
  });

  client.setCredentials({ access_token: session.accessToken });

  return client;
}

export const googleCalClient = google.calendar("v3");
