import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";

import { taskSchema } from "$lib/client/features/task/schema";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask
} from "$lib/server/services/task";

import type { ErrorResponse, SuccessResponse, Task, User } from "$lib/types";

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
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .get("/get/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing task ID" });

      const task = await getTask(id);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: "Success",
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
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
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .put("/update/:id", zValidator("json", taskSchema), async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing task ID" });

      const data = c.req.valid("json");

      const task = await updateTask(id, data);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} updated`,
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .delete("/delete/:id", async (c) => {
    try {
      const id = c.req.param("id");
      if (!id) return c.json<ErrorResponse>({ success: false, message: "Missing task ID" });

      const task = await deleteTask(id);

      return c.json<SuccessResponse<Task>>({
        success: true,
        message: `${task.name} deleted`,
        data: task
      });
      // biome-ignore lint:
    } catch (err: any) {
      console.error("error:", err);
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  });

export default app;
