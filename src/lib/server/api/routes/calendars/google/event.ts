import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { googleAuth } from "$lib/server/api/middlewares/google-auth";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { googleCalClient } from "$lib/server/calendars/google";

const app = new Hono<Context>().get("/getAll", loggedIn, googleAuth, async (c) => {
  const accessToken = c.get("accessToken");

  try {
    const googleCal = await googleCalClient(accessToken);

    console.log("Events:", googleCal.events.list({ calendarId: "primary" }));

    return c.json({ success: true });
    // biome-ignore lint:
  } catch (err: any) {
    console.log("error:", err.message);
    return c.json({ success: false, message: err.message });
  }
});

export default app;
