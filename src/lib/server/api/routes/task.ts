import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { taskService } from "$lib/server/services/task";

import { taskSchema } from "$lib/shared/schemas/task";
import type { SuccessResponse, Task, User } from "$lib/shared/types";

import { errorResponse, requireParam } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const tasks = await taskService.getAll(user.id);

      return c.json<SuccessResponse<Task[]>>({
        success: true,
        message: "Success",
        data: tasks
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "task id");

      const task = await taskService.get(id);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: "Success",
        data: task
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/create", zValidator("json", taskSchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const task = await taskService.create(user.id, data);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} created`,
        data: task
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .put("/update/:id", zValidator("json", taskSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "task id");

      const data = c.req.valid("json");

      const task = await taskService.update(id, data);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} updated`,
        data: task
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParam(c, "task id");

      const task = await taskService.delete(id);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} deleted`,
        data: task
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  })
  .post("/clear", async (c) => {
    try {
      const user = c.get("user") as User;

      await taskService.clearCache(user.id);

      return c.json<SuccessResponse<null>>({
        success: true,
        message: "Successfully cleared all the tasks from cache",
        data: null
      });
    } catch (err: unknown) {
      return errorResponse(c, err);
    }
  });

export default app;
