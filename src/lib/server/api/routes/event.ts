import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { eventService } from "$lib/server/services/event";

import { eventSchema } from "$lib/shared/schemas/event";
import type { Event, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse, requireParam } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const events = await eventService.getAll(user.id);

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
      if (!id) return requireParam(c, "event id");

      const event = await eventService.get(id);

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

      const event = await eventService.create(user.id, data);

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
      if (!id) return requireParam(c, "event id");

      const data = c.req.valid("json");

      const event = await eventService.update(id, data);

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
      if (!id) return requireParam(c, "event id");

      const event = await eventService.delete(id);

      return c.json<SuccessResponse<Event>>({
        success: true,
        message: `${event.name} deleted`,
        data: event
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/clearCache", async (c) => {
    try {
      const user = c.get("user") as User;

      await eventService.clearCache(user.id);

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
