import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { googleCalClient } from "$lib/server/calendars/google";

import type { SuccessResponse, User } from "$lib/types";

const app = new Hono<Context>().get("/getAll", loggedIn, async (c) => {
  try {
    const user = c.get("user") as User;
    const googleCal = await googleCalClient(user.id);

    const data = await googleCal.events.list({
      calendarId: "primary",
      maxResults: 2500
    });

    const events = data.data.items ?? [];

    // console.log("Events:", events);

    return c.json<SuccessResponse<typeof data.data.items>>({
      success: true,
      message: "Success",
      data: events
    });
    // biome-ignore lint:
  } catch (err: any) {
    console.log("error:", err);
    return c.json({ success: false, message: err.message });
  }
});

export default app;
