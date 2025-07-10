import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  clearEvents,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  updateEvent
} from "$lib/server/services/event";

import { eventSchema } from "$lib/shared/schemas/event";
import type { Event, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse, requireParamId } from "../utils";

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
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "event");

      const event = await getEvent(id);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: "Success",
        data: event
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
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
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .put("/update/:id", zValidator("json", eventSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "event");

      const data = c.req.valid("json");

      const event = await updateEvent(id, data);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: `${event.name} updated`,
        data: event
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "event");

      const event = await deleteEvent(id);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: `${event.name} deleted`,
        data: event
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/clear", async (c) => {
    try {
      const user = c.get("user") as User;

      await clearEvents(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Successfully cleared all the events from cache",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
