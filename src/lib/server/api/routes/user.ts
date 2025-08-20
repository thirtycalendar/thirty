import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { getCreditByUserId } from "$lib/server/services/credit";

import type { Credit, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse } from "../utils";

export const userRoute = new Hono<Context>().use(loggedIn).get("/credit", async (c) => {
  try {
    const user = c.get("user") as User;

    const credits = await getCreditByUserId(user.id);

    return c.json<SuccessResponse<Credit>>({
      success: true,
      message: "Success",
      data: credits
    });
  } catch (err: unknown) {
    return errorResponse(c, err);
  }
});
