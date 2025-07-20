import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { birthdayServices } from "$lib/server/services/birthday";

import { birthdaySchema } from "$lib/shared/schemas/birthday";
import type { Birthday, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse, requireParam } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const birthdays = await birthdayServices.getAll(user.id);

      return c.json<SuccessResponse<Birthday[]>>({
        success: true,
        message: "Success",
        data: birthdays
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "birthday id");

      const birthday = await birthdayServices.get(id);

      return c.json<SuccessResponse<Birthday>>({
        success: true,
        message: "Success",
        data: birthday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/create", zValidator("json", birthdaySchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const birthday = await birthdayServices.create(user.id, data);

      return c.json<SuccessResponse<Birthday>>({
        success: true,
        message: `${birthday.name} created`,
        data: birthday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .put("/update/:id", zValidator("json", birthdaySchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "birthday id");

      const data = c.req.valid("json");

      const birthday = await birthdayServices.update(id, data);

      return c.json<SuccessResponse<Birthday>>({
        success: true,
        message: `${birthday.name} updated`,
        data: birthday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "birthday id");

      const birthday = await birthdayServices.delete(id);

      return c.json<SuccessResponse<Birthday>>({
        success: true,
        message: `${birthday.name} deleted`,
        data: birthday
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/clear", async (c) => {
    try {
      const user = c.get("user") as User;

      await birthdayServices.clearCache(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Successfully cleared all the birthdays from cache",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
