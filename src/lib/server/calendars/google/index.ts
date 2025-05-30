import { GOOGLE_CLIENT_DEV_ID, GOOGLE_CLIENT_DEV_SECRET } from "$env/static/private";

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
    clientId: GOOGLE_CLIENT_DEV_ID,
    clientSecret: GOOGLE_CLIENT_DEV_SECRET
  });

  client.setCredentials({ access_token: session.accessToken });

  return client;
}

export const googleCalClient = google.calendar("v3");
