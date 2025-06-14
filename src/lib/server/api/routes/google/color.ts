import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { cacheGoogleCalData } from "$lib/server/calendars/google/cache";
import { kv } from "$lib/server/utils/upstash/kv";

import type { Color, ErrorResponse, SuccessResponse, User } from "$lib/types";
import { KV_GOOGLE_COLORS } from "$lib/utils/kv-keys";

const app = new Hono<Context>().use(loggedIn).get("/getAll", async (c) => {
  try {
    const user = c.get("user") as User;
    const cached = await kv.get<Color>(KV_GOOGLE_COLORS(user.id));
    if (cached)
      return c.json<SuccessResponse<Color>>({ success: true, message: "Success", data: cached });

    const { colors } = await cacheGoogleCalData(user.id);

    return c.json<SuccessResponse<Color>>({
      success: true,
      message: "Success",
      data: colors
    });
    // biome-ignore lint:
  } catch (err: any) {
    console.log("error:", err);
    return c.json<ErrorResponse>({ success: false, message: err.message });
  }
});

export default app;
