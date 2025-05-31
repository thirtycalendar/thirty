import { google } from "googleapis";
import { Hono } from "hono";

import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { googleScopes } from "$lib/server/auth/scopes/google";
import { kv } from "$lib/server/utils/upstash/kv";

import type { User } from "$lib/types";

const clientId = "650863488809-tn78624kd0pkr9v4l9o3097pono4t2up.apps.googleusercontent.com";
const clientSecret = "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";
const redirectUri = "http://localhost:5173/api/permission/google/callback"; // e.g. https://yourapp.com/api/oauth/callback
const KV_KEY = (userId: string) => `google:auth:${userId}`;

const createOAuthClient = () => new google.auth.OAuth2(clientId, clientSecret, redirectUri);

export function requestCalendarPermission(userId: string) {
  const oauth2Client = createOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: googleScopes,
    state: userId
  });
  return url;
}

export async function storeGoogleSessionToKV(userId: string, code: string) {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) throw new Error("Missing refresh token");

  const session = {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expiry_date ? tokens.expiry_date - Date.now() : 3600_000)
  };

  console.log("Session:", session);

  await kv.set(KV_KEY(userId), session);
}

export async function refreshGoogleAccessToken(userId: string) {
  const session = await kv.get<{ refreshToken: string }>(KV_KEY(userId));
  if (!session?.refreshToken) throw new Error("Missing refresh token");

  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials({ refresh_token: session.refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    await kv.set(KV_KEY(userId), {
      ...session,
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date
    });

    return credentials.access_token;
    // biome-ignore lint:
  } catch (err: any) {
    if (err.response?.data?.error === "invalid_grant") {
      await deleteGoogleSessionFromKV(userId);
      return null;
    }
    throw err;
  }
}

export async function checkRefreshTokenStillValid(userId: string) {
  const token = await refreshGoogleAccessToken(userId);
  if (!token) {
    return false;
  }
  return true;
}

export async function deleteGoogleSessionFromKV(userId: string) {
  await kv.del(KV_KEY(userId));
}

// --- Example Hono Routes ---

const app = new Hono();

app.get("/google/authorize", loggedIn, (c) => {
  const user = c.get("user") as User;
  const url = requestCalendarPermission(user.id);
  return c.redirect(url);
});

app.get("/google/callback", async (c) => {
  const code = c.req.query("code");
  const userId = c.req.query("state");
  if (!code || !userId) return c.text("Missing code or userId", 400);

  try {
    await storeGoogleSessionToKV(userId, code);
    return c.redirect("http://localhost:5173/calendar");
  } catch (err) {
    return c.text(`Error: ${(err as Error).message}`, 500);
  }
});

app.get("/google/check", loggedIn, async (c) => {
  const user = c.get("user") as User;

  const isValid = await checkRefreshTokenStillValid(user.id);
  return c.json({ valid: isValid });
});

app.delete("/google/disconnect", async (c) => {
  const userId = c.req.query("userId");
  if (!userId) return c.text("Missing userId", 400);

  await deleteGoogleSessionFromKV(userId);
  return c.text("Google Calendar session deleted");
});

export default app;
