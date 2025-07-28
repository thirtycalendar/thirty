import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { holidayService } from "$lib/server/services/holiday";
import { getIPLocation } from "$lib/server/libs/ipwhois/utils";

import { hdCountrySchema } from "$lib/shared/schemas/holiday";
import type { Holiday, HolidayCountry, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse, requireParam } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const holidays = await holidayService.getHolidays(user.id);

      return c.json<SuccessResponse<Holiday[]>>({
        success: true,
        message: "Success",
        data: holidays
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/country/detect", async (c) => {
    try {
      const user = c.get("user") as User;

      const ipLocation = await getIPLocation(user.id);
      const countryCode = ipLocation.countryCode;

      await holidayService.addCountryByCode(user.id, countryCode);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Success",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/country/list", async (c) => {
    try {
      const holidays = await holidayService.getAllHolidayCountries();

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

      const countries = await holidayService.getCountries(user.id);

      return c.json<SuccessResponse<HolidayCountry[]>>({
        success: true,
        message: "Success",
        data: countries
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/country/add", zValidator("json", hdCountrySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const country = await holidayService.addCountry(user.id, data);

      return c.json<SuccessResponse<HolidayCountry>>({
        success: true,
        message: `${country.countryName} added`,
        data: country
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/country/remove/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "holiday country id");

      const user = c.get("user") as User;

      const removed = await holidayService.removeCountry(user.id, id);

      return c.json<SuccessResponse<HolidayCountry>>({
        success: true,
        message: `${removed.countryName} removed`,
        data: removed
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/clearCache", async (c) => {
    try {
      const user = c.get("user") as User;

      await holidayService.clearCache(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Successfully cleared all the cached holiday countries and holidays",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
