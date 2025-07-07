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

import { holidaySchema } from "$lib/shared/schemas/holiday";
import type { Holiday, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const holidays = await getHolidays(user.id);

      return c.json<SuccessResponse<Holiday[]>>({
        success: true,
        message: "Success",
        data: holidays
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .post("/add", zValidator("json", holidaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const holiday = await addHoliday(user.id, data);

      return c.json<SuccessResponse<Holiday>>({
        success: true,
        message: `${holiday.countryName} added`,
        data: holiday
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .delete("/remove", zValidator("json", holidaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const removed = await removeHoliday(user.id, data);

      return c.json<SuccessResponse<Holiday>>({
        success: true,
        message: `${removed.countryName} removed`,
        data: removed
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  });

export default app;
