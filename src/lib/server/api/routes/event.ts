import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import { eventSchema } from "$lib/client/features/event/schema";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent
} from "$lib/server/services/event";

import type { ErrorResponse, Event, SuccessResponse, User } from "$lib/types";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const events = await getAllEvents(user.id);

      return c.json<SuccessResponse<Event[]>>({
        success: true,
        message: "Success",
        data: events
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing event ID" });

      const event = await getEvent(id);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: "Success",
        data: event
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .post("/create", zValidator("json", eventSchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const event = await createEvent(user.id, data);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: `${event.name} created`,
        data: event
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .put("/update/:id", zValidator("json", eventSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing event ID" });

      const data = c.req.valid("json");

      const event = await updateEvent(id, data);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: `${event.name} updated`,
        data: event
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing event ID" });

      const event = await deleteEvent(id);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: `${event.name} deleted`,
        data: event
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  });

export default app;
