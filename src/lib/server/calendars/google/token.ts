import { google } from "googleapis";

import { kv } from "$lib/server/utils/upstash/kv";

import type { GoogleSession } from "$lib/types/server";
import { googleEnvConfig } from "$lib/utils/env-configs";
import { KV_GOOGLE_TOKEN } from "$lib/utils/kv-keys";

export async function storeGoogleSessionToKV(session: GoogleSession) {
  await kv.set(KV_GOOGLE_TOKEN(session.userId), session);
}

export async function getGoogleAccessToken(userId: string): Promise<string | null> {
  const session = await kv.get<GoogleSession>(KV_GOOGLE_TOKEN(userId));

  if (!session) return null;

  const isExpired = new Date(session.accessTokenExpiresAt).getTime() < Date.now() + 60_000;
  if (!isExpired) return session.accessToken;

  const client = new google.auth.OAuth2({
    clientId: googleEnvConfig.clientId,
    clientSecret: googleEnvConfig.clientSecret
  });

  client.setCredentials({
    refresh_token: session.refreshToken
  });

  try {
    const tokens = await client.getAccessToken();

    if (!tokens.token) throw new Error("No access token returned");

    const creds = client.credentials;

    const updated: GoogleSession = {
      userId,
      accessToken: tokens.token,
      refreshToken: creds.refresh_token ?? session.refreshToken,
      idToken: creds.id_token ?? session.idToken,
      accessTokenExpiresAt: new Date(creds.expiry_date ?? Date.now() + 3600_000).toISOString()
    };

    await kv.set(KV_GOOGLE_TOKEN(userId), updated);
    return updated.accessToken;
  } catch (err) {
    console.error("Failed to refresh Google access token", err);
    return null;
  }
}
