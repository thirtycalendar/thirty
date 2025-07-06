import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  createCalendar,
  deleteCalendar,
  getAllCalendars,
  getCalendar,
  updateCalendar
} from "$lib/server/services/calendar";
import { updateInitCalendarTimezone } from "$lib/server/calendars/local/init-calendar";

import { calendarSchema, initCalendarStateSchema } from "$lib/shared/schemas/calendar";
import type { Calendar, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse, requireParamId } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .post("/updateInit", zValidator("json", initCalendarStateSchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const calendar = await updateInitCalendarTimezone(user.id, data);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: `Updated initialized ${calendar.name} calendar`,
        data: calendar
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const calendars = await getAllCalendars(user.id);

      return c.json<SuccessResponse<Calendar[]>>({
        success: true,
        message: "Success",
        data: calendars
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "calendar");

      const calendar = await getCalendar(id);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: "Success",
        data: calendar
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .put("/update/:id", zValidator("json", calendarSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "calendar");

      const data = c.req.valid("json");

      const calendar = await updateCalendar(id, data);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: `${calendar.name} updated`,
        data: calendar
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "calendar");

      const calendar = await deleteCalendar(id);

      return c.json<SuccessResponse<Calendar>>({
        success: true,
        message: `${calendar.name} deleted`,
        data: calendar
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  });

export default app;
