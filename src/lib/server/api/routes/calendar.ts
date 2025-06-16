import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import { calendarSchema } from "$lib/client/features/calendar/schema";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  createCalendar,
  deleteCalendar,
  getAllCalendars,
  getCalendar,
  updateCalendar
} from "$lib/server/services/calendar";

import type { Calendar, ErrorResponse, SuccessResponse, User } from "$lib/types";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const calendars = await getAllCalendars(user.id);

      return c.json<SuccessResponse<Calendar[]>>({
        success: true,
        message: "Success",
        data: calendars
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
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing calendar ID" });

      const calendar = await getCalendar(id);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: "Success",
        data: calendar
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .post("/create", zValidator("json", calendarSchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const calendar = await createCalendar(user.id, data);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: `${calendar.name} created`,
        data: calendar
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .put("/update/:id", zValidator("json", calendarSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing calendar ID" });

      const data = c.req.valid("json");

      const calendar = await updateCalendar(id, data);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: `${calendar.name} updated`,
        data: calendar
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
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing calendar ID" });

      const calendar = await deleteCalendar(id);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: `${calendar.name} deleted`,
        data: calendar
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  });

export default app;
