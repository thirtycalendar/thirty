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

  const expiresInMs = new Date(session.accessTokenExpiresAt).getTime() - Date.now();
  const isExpired = expiresInMs < 60_000;

  if (!isExpired) return session.accessToken;

  const client = new google.auth.OAuth2({
    clientId: googleEnvConfig.clientId,
    clientSecret: googleEnvConfig.clientSecret
  });

  client.setCredentials({ refresh_token: session.refreshToken });

  try {
    const { credentials } = await client.refreshAccessToken();

    const updated: GoogleSession = {
      userId,
      accessToken: credentials.access_token as string,
      refreshToken: credentials.refresh_token ?? session.refreshToken,
      idToken: credentials.id_token ?? session.idToken,
      accessTokenExpiresAt: new Date(credentials.expiry_date ?? Date.now() + 3600_000).toISOString()
    };

    await kv.set(KV_GOOGLE_TOKEN(userId), updated);
    return updated.accessToken;
    // biome-ignore lint:
  } catch (err: any) {
    const code = err?.response?.data?.error;
    if (code === "invalid_grant") {
      console.warn("Refresh token invalid or revoked for user:", userId);
      // optionally clear session or mark it for re-auth
    } else {
      console.error("Failed to refresh Google access token", err);
    }
    return null;
  }
}
