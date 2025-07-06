import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask
} from "$lib/server/services/task";

import { taskSchema } from "$lib/shared/schemas/task";
import type { SuccessResponse, Task, User } from "$lib/shared/types";

import { errorResponse, requireParamId } from "../utils";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;

      const tasks = await getAllTasks(user.id);

      return c.json<SuccessResponse<Task[]>>({
        success: true,
        message: "Success",
        data: tasks
      });
      // biome-ignore lint:
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "task");

      const task = await getTask(id);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: "Success",
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .post("/create", zValidator("json", taskSchema), async (c) => {
    try {
      const user = c.get("user") as User;
      const data = c.req.valid("json");

      const task = await createTask(user.id, data);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} created`,
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .put("/update/:id", zValidator("json", taskSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "task");

      const data = c.req.valid("json");

      const task = await updateTask(id, data);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} updated`,
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return requireParamId(c, "task");

      const task = await deleteTask(id);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} deleted`,
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      return errorResponse(c, err.message);
    }
  });

export default app;
