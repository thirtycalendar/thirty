import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { getOAuthClient, googleCalClient } from "$lib/server/calendars/google";

const app = new Hono<Context>().get("/getAll", loggedIn, async (c) => {
  try {
    const oAuthClient = await getOAuthClient(c);

    const events = googleCalClient.events.list({
      calendarId: "primary",
      eventTypes: ["default"],
      singleEvents: true,
      maxResults: 2500,
      auth: oAuthClient
    });

    console.log("Events:", events);

    return c.json({ success: true });
    // biome-ignore lint:
  } catch (err: any) {
    console.log("error:", err);
    return c.json({ success: false, message: err.message });
  }
});

export default app;
