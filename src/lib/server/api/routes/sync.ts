import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { syncGoogleCalendars, syncGoogleEvents } from "$lib/server/services/sync/google";
import { auth } from "$lib/server/auth";
import { kv } from "$lib/server/libs/upstash/kv";
import { KV_CALENDARS, KV_EVENTS } from "$lib/server/utils/kv-keys";

import type { SuccessResponse, User } from "$lib/shared/types";

import { errorResponse } from "../utils";

export const syncRoute = new Hono<Context>().use(loggedIn).post("/google", async (c) => {
  try {
    const user = c.get("user") as User;

    const { accessToken, accessTokenExpiresAt } = await auth.api.getAccessToken({
      body: { providerId: "google", userId: user.id },
      headers: c.req.raw.headers
    });

    if (!accessTokenExpiresAt || accessTokenExpiresAt <= new Date()) {
      return errorResponse(
        c,
        "Your Google Calendar access has expired. Please sign in with Google again to keep syncing."
      );
    }

    await Promise.all([kv.del(KV_CALENDARS(user.id)), kv.del(KV_EVENTS(user.id))]);

    await syncGoogleCalendars(user.id, accessToken);
    await syncGoogleEvents(user.id, accessToken);

    return c.json<SuccessResponse<null>>({
      success: true,
      message: "Google Calendar successfully synced",
      data: null
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});
