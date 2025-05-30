import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { getOAuthClient, googleCalClient } from "$lib/server/calendars/google";

import type { SuccessResponse } from "$lib/types";

const app = new Hono<Context>().get("/getAll", loggedIn, async (c) => {
  try {
    const oAuthClient = await getOAuthClient(c);

    const data = await googleCalClient.calendars.get({ auth: oAuthClient });

    // console.log("Calendars:", data);

    return c.json<SuccessResponse<typeof data>>({
      success: true,
      message: "Success",
      data: data
    });
    // biome-ignore lint:
  } catch (err: any) {
    console.log("error:", err);
    return c.json({ success: false, message: err.message });
  }
});

export default app;
