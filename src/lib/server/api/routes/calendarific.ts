import { Hono } from "hono";

import { cacheHolidaysToKV } from "$lib/server/libs/calendarific/cache";

import type { SuccessResponse } from "$lib/shared/types";

import type { Context } from "../context";
import { errorResponse } from "../utils";

const app = new Hono<Context>().get("/cache/:indexId", async (c) => {
  try {
    const index = c.req.param("indexId");

    cacheHolidaysToKV(Number(index));

    return c.json<SuccessResponse<null>>({
      success: true,
      message: `Success`,
      data: null
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});

export default app;
