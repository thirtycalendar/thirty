import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { syncGoogleCalendars, syncGoogleEvents } from "$lib/server/services/sync/google";
import { kv } from "$lib/server/libs/upstash/kv";
import { KV_CALENDARS, KV_EVENTS } from "$lib/server/utils/kv-keys";

import type { SuccessResponse, User } from "$lib/shared/types";

import { errorResponse } from "../utils";

export const syncRoute = new Hono<Context>().use(loggedIn).post("/google", async (c) => {
  try {
    const user = c.get("user") as User;

    await kv.del(KV_CALENDARS(user.id));
    await kv.del(KV_EVENTS(user.id));

    await syncGoogleCalendars(user.id);

    await syncGoogleEvents(user.id);

    return c.json<SuccessResponse<null>>({
      success: true,
      message: "Successfully synced all Google Calendars and Events",
      data: null
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});
