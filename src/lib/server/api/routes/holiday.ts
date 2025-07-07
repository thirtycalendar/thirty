import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  addHoliday,
  clearHolidays,
  getHolidays,
  removeHoliday
} from "$lib/server/services/holiday";
import { getIPLocation } from "$lib/server/libs/ipwhois/utils";

import { holidaySchema } from "$lib/shared/schemas/holiday";
import type { Holiday, HolidayForm, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .post("/detect", async (c) => {
    try {
      const user = c.get("user") as User;

      const ipLocation = await getIPLocation(user.id);

      const data: HolidayForm = {
        country: ipLocation.country
      };

      const holiday = await addHoliday(user.id, data);

      return c.json<SuccessResponse<Holiday>>({
        success: true,
        message: `${holiday.country} added`,
        data: holiday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const holidays = await getHolidays(user.id);

      return c.json<SuccessResponse<Holiday[]>>({
        success: true,
        message: "Success",
        data: holidays
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/add", zValidator("json", holidaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const holiday = await addHoliday(user.id, data);

      return c.json<SuccessResponse<Holiday>>({
        success: true,
        message: `${holiday.country} added`,
        data: holiday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/remove", zValidator("json", holidaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const removed = await removeHoliday(user.id, data);

      return c.json<SuccessResponse<Holiday>>({
        success: true,
        message: `${removed.country} removed`,
        data: removed
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/clearHolidays", async (c) => {
    try {
      const user = c.get("user") as User;

      await clearHolidays(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Successfully cleared all the holidays",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
