import { kv } from "$lib/server/utils/upstash/kv";

import type { GoogleSession } from "$lib/types/server";

export async function storeGoogleSessionToKV(session: GoogleSession) {
  const key = `google:auth:${session.userId}`;

  console.log("session for KV:", session);

  await kv.set(key, session);
}
