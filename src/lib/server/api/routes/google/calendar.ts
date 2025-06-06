import type { calendar_v3 } from "@googleapis/calendar";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { fetchAndCacheAllGoogleCalData } from "$lib/server/calendars/google/cache";
import { getGoogleClients } from "$lib/server/calendars/google/client";
import { kv } from "$lib/server/utils/upstash/kv";

import type { ErrorResponse, SuccessResponse, User } from "$lib/types";
import { KV_GOOGLE_CALENDARS } from "$lib/utils/kv-keys";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;
      const cached = await kv.get<calendar_v3.Schema$CalendarListEntry[]>(
        KV_GOOGLE_CALENDARS(user.id)
      );
      if (cached) return c.json({ success: true, data: cached });

      const { calendars } = await fetchAndCacheAllGoogleCalData(user.id);

      return c.json<SuccessResponse<calendar_v3.Schema$CalendarListEntry[]>>({
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
  .get("/:id", async (c) => {
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
      await fetchAndCacheAllGoogleCalData(user.id);

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
  .put("/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");
      const body = (await c.req.json()) as Partial<calendar_v3.Schema$Calendar>;

      const { calendar } = await getGoogleClients(user.id);
      const res = await calendar.calendars.patch({ calendarId: id, requestBody: body });
      await fetchAndCacheAllGoogleCalData(user.id);

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
  .delete("/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");

      const { calendar } = await getGoogleClients(user.id);
      await calendar.calendars.delete({ calendarId: id });
      await fetchAndCacheAllGoogleCalData(user.id);

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
