import type { calendar_v3 } from "@googleapis/calendar";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { cacheGoogleCalData } from "$lib/server/calendars/google/cache";
import { getGoogleClients } from "$lib/server/calendars/google/client";
import { kv } from "$lib/server/utils/upstash/kv";

import type { Calendar, ErrorResponse, SuccessResponse, User } from "$lib/types";
import { KV_GOOGLE_CALENDARS } from "$lib/utils/kv-keys";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;
      const cached = await kv.get<Calendar[]>(KV_GOOGLE_CALENDARS(user.id));

      if (cached)
        return c.json<SuccessResponse<Calendar[]>>({
          success: true,
          message: "Success",
          data: cached
        });

      const { calendars } = await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<Calendar[]>>({
        success: true,
        message: "Success",
        data: calendars
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.log("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const { calendar } = await getGoogleClients(user.id);
      const id = c.req.param("id");
      const res = await calendar.calendars.get({ calendarId: id });
      if (!res.data) throw new Error("Calendar not found");

      return c.json<SuccessResponse<calendar_v3.Schema$Calendar>>({
        success: true,
        message: "Success",
        data: res.data
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .post("/create", async (c) => {
    try {
      const user = c.get("user") as User;
      const body = (await c.req.json()) as calendar_v3.Schema$Calendar;

      const { calendar } = await getGoogleClients(user.id);
      const res = await calendar.calendars.insert({ requestBody: body });
      await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<calendar_v3.Schema$Calendar>>({
        success: true,
        message: "Calendar created",
        data: res.data
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .put("/update/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");
      const body = (await c.req.json()) as Partial<calendar_v3.Schema$Calendar>;

      const { calendar } = await getGoogleClients(user.id);
      const res = await calendar.calendars.patch({ calendarId: id, requestBody: body });
      await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<calendar_v3.Schema$Calendar>>({
        success: true,
        message: "Calendar updated",
        data: res.data
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");

      const { calendar } = await getGoogleClients(user.id);
      await calendar.calendars.delete({ calendarId: id });
      await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Calendar deleted",
        data: null
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  });

export default app;
