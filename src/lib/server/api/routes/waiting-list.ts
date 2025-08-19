import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { waitingListServices } from "$lib/server/services/waiting-list";

import { waitingListSchema } from "$lib/shared/schemas/waiting-list";
import type { SuccessResponse } from "$lib/shared/types";

import { errorResponse } from "../utils";

const app = new Hono<Context>()
  .get("/count", async (c) => {
    try {
      const count = await waitingListServices.getCount();

      return c.json<SuccessResponse<{ count: number }>>({
        success: true,
        message: "Waiting list count fetched successfully",
        data: { count }
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/add", zValidator("json", waitingListSchema), async (c) => {
    try {
      const data = c.req.valid("json");

      const added = await waitingListServices.addEmail(data.email);

      const message = added
        ? "You're +1 on the waiting list! Thanks for joining ✨"
        : "Thanks for coming back! You're already +1 on the waiting list 🙌";

      return c.json<SuccessResponse<null>>({
        success: true,
        message,
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
