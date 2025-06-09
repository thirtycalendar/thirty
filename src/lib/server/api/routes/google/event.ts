import type { calendar_v3 } from "@googleapis/calendar";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { cacheGoogleCalData } from "$lib/server/calendars/google/cache";
import { getGoogleClients } from "$lib/server/calendars/google/client";
import { kv } from "$lib/server/utils/upstash/kv";

import type { ErrorResponse, Event, SuccessResponse, User, UtilEvent } from "$lib/types";
import { KV_GOOGLE_EVENTS, KV_GOOGLE_UTIL_EVENTS } from "$lib/utils/kv-keys";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;
      const cachedEvents = await kv.get<Event[]>(KV_GOOGLE_EVENTS(user.id));
      const cachedUtilEvents = await kv.get<UtilEvent[]>(KV_GOOGLE_UTIL_EVENTS(user.id));

      if (cachedEvents && cachedUtilEvents) {
        return c.json<SuccessResponse<{ events: Event[]; utilEvents: UtilEvent[] }>>({
          success: true,
          message: "Success",
          data: { events: cachedEvents, utilEvents: cachedUtilEvents }
        });
      }

      const { events, utilEvents } = await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<{ events: Event[]; utilEvents: UtilEvent[] }>>({
        success: true,
        message: "Success",
        data: { events, utilEvents }
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");
      const { calendar } = await getGoogleClients(user.id);

      // You need calendarId in query or fallback to "primary"
      const calendarId = c.req.query("calendarId") ?? "primary";
      const res = await calendar.events.get({ calendarId, eventId: id });

      if (!res.data) throw new Error("Event not found");
      return c.json<SuccessResponse<calendar_v3.Schema$Event>>({
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
      const body = (await c.req.json()) as calendar_v3.Schema$Event;

      const { calendar } = await getGoogleClients(user.id);
      const calendarId = body.organizer?.email ?? "primary";

      const res = await calendar.events.insert({
        calendarId,
        requestBody: body
      });

      await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<calendar_v3.Schema$Event>>({
        success: true,
        message: "Event created",
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
      const body = (await c.req.json()) as Partial<calendar_v3.Schema$Event>;

      const { calendar } = await getGoogleClients(user.id);

      // Need calendarId in query or fallback to "primary"
      const calendarId = c.req.query("calendarId") ?? "primary";

      const res = await calendar.events.patch({
        calendarId,
        eventId: id,
        requestBody: body
      });

      await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<calendar_v3.Schema$Event>>({
        success: true,
        message: "Event updated",
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

      // Need calendarId in query or fallback to "primary"
      const calendarId = c.req.query("calendarId") ?? "primary";

      await calendar.events.delete({
        calendarId,
        eventId: id
      });

      await cacheGoogleCalData(user.id);

      return c.json<SuccessResponse<null>>({ success: true, message: "Event deleted", data: null });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  });

export default app;
