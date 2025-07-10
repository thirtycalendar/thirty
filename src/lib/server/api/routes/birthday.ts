import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  clearBirthdays,
  createBirthday,
  deleteBirthday,
  getAllBirthdays,
  getBirthday,
  updateBirthday
} from "$lib/server/services/birthday";

import { birthdaySchema } from "$lib/shared/schemas/birthday";
import type { Birthday, SuccessResponse, User } from "$lib/shared/types";

import { errorResponse, requireParamId } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const birthdays = await getAllBirthdays(user.id);

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
      if (!id) return requireParamId(c, "birthday");

      const birthday = await getBirthday(id);

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

      const birthday = await createBirthday(user.id, data);

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
      if (!id) return requireParamId(c, "birthday");

      const data = c.req.valid("json");

      const birthday = await updateBirthday(id, data);

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
      if (!id) return requireParamId(c, "birthday");

      const birthday = await deleteBirthday(id);

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

      await clearBirthdays(user.id);

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
