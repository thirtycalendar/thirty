import { auth } from "$lib/server/auth";
import { kv } from "$lib/server/utils/upstash/kv";

import type { GoogleSession } from "$lib/types/server";

export async function storeGoogleSessionToKV(userId: string, headers: Headers) {
  const key = `google:auth:${userId}`;

  const token = await auth.api.refreshToken({
    body: { providerId: "google", userId },
    headers
  });

  if (!token.accessToken || !token.refreshToken || !token.idToken || !token.accessTokenExpiresAt) {
    throw new Error("Invalid Google token response");
  }

  const session: GoogleSession = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    idToken: token.idToken,
    expiresAt: token.accessTokenExpiresAt.toISOString()
  };

  console.log("session for KV:", session);

  await kv.set(key, session);
}
