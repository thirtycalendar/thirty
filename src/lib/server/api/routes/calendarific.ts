import { Hono } from "hono";

import { cacheHolidaysToKV } from "$lib/server/libs/calendarific/cache";

import type { SuccessResponse } from "$lib/shared/types";

import type { Context } from "../context";
import { errorResponse } from "../utils";

export const calendarificRoute = new Hono<Context>().get("/cache", async (c) => {
  try {
    cacheHolidaysToKV();

    return c.json<SuccessResponse<null>>({
      success: true,
      message: `Success`,
      data: null
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});
