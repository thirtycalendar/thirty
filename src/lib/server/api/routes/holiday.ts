import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  addUserHolidayCountry,
  addUserHolidayCountryByItsCode,
  clearUserHolidayCountries,
  getUserHolidayCountries,
  getUserHolidays,
  removeUserHolidayCountry
} from "$lib/server/services/holiday";
import { getHolidayCountries } from "$lib/server/libs/calendarific/cache";
import { getIPLocation } from "$lib/server/libs/ipwhois/utils";

import { holidaySchema } from "$lib/shared/schemas/holiday";
import type { Holiday, HolidayCountry, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .post("/detect", async (c) => {
    try {
      const user = c.get("user") as User;

      const ipLocation = await getIPLocation(user.id);
      const countryCode = ipLocation.countryCode;

      await addUserHolidayCountryByItsCode(user.id, countryCode);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Success",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const holidays = await getUserHolidays(user.id);

      return c.json<SuccessResponse<Holiday[]>>({
        success: true,
        message: "Success",
        data: holidays
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/country/list", async (c) => {
    try {
      const holidays = await getHolidayCountries();

      return c.json<SuccessResponse<HolidayCountry[]>>({
        success: true,
        message: "Success",
        data: holidays
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/country/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const holidays = await getUserHolidayCountries(user.id);

      return c.json<SuccessResponse<HolidayCountry[]>>({
        success: true,
        message: "Success",
        data: holidays
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/country/add", zValidator("json", holidaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const holiday = await addUserHolidayCountry(user.id, data);

      return c.json<SuccessResponse<HolidayCountry>>({
        success: true,
        message: `${holiday.countryName} added`,
        data: holiday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/country/remove", zValidator("json", holidaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const removed = await removeUserHolidayCountry(user.id, data);

      return c.json<SuccessResponse<HolidayCountry>>({
        success: true,
        message: `${removed.countryName} removed`,
        data: removed
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/country/clear", async (c) => {
    try {
      const user = c.get("user") as User;

      await clearUserHolidayCountries(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Successfully cleared all the holidays from cache",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
