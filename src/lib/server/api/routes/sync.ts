import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { syncGoogleCalendars, syncGoogleEvents } from "$lib/server/services/sync/google";

import type { SuccessResponse, User } from "$lib/types";

import { errorResponse } from "../utils";

const app = new Hono<Context>().use(loggedIn).post("/google", async (c) => {
  try {
    const user = c.get("user") as User;

    await syncGoogleCalendars(user.id);

    await syncGoogleEvents(user.id);

    return c.json<SuccessResponse<null>>({
      success: true,
      message: "Successfully synced all Google Calendars and Events",
      data: null
    });
    // biome-ignore lint:
  } catch (err: any) {
    return errorResponse(c, err.message);
  }
});

export default app;
