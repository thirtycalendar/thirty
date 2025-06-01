import type { tasks_v1 } from "@googleapis/tasks";

import { Hono } from "hono";

import type { Context } from "$lib/server/api/context";
import { loggedIn } from "$lib/server/api/middlewares/logged-in";
import { getGoogleClients } from "$lib/server/calendars/google";
import { fetchAndCacheAllGoogleCalData } from "$lib/server/calendars/google/fetch-cache-google-cal";
import { kv } from "$lib/server/utils/upstash/kv";

import type { ErrorResponse, SuccessResponse, User } from "$lib/types";

const app = new Hono<Context>()
  .use(loggedIn)
  .get("/getAll", async (c) => {
    try {
      const user = c.get("user") as User;
      const cached = await kv.get<tasks_v1.Schema$Task[]>(`google:${user.id}:tasks`);
      if (cached) {
        return c.json<SuccessResponse<tasks_v1.Schema$Task[]>>({
          success: true,
          message: "Success",
          data: cached
        });
      }
      const { tasks } = await fetchAndCacheAllGoogleCalData(user.id);
      return c.json<SuccessResponse<tasks_v1.Schema$Task[]>>({
        success: true,
        message: "Success",
        data: tasks
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .get("/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");
      const tasklistId = c.req.query("tasklistId");
      if (!tasklistId) throw new Error("tasklistId is required");

      const { tasks } = await getGoogleClients(user.id);
      const res = await tasks.tasks.get({ tasklist: tasklistId, task: id });

      if (!res.data) throw new Error("Task not found");

      return c.json<SuccessResponse<tasks_v1.Schema$Task>>({
        success: true,
        message: "Success",
        data: res.data
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .post("/create", async (c) => {
    try {
      const user = c.get("user") as User;
      const body = (await c.req.json()) as tasks_v1.Schema$Task;
      const tasklistId = c.req.query("tasklistId");
      if (!tasklistId) throw new Error("tasklistId is required");

      const { tasks } = await getGoogleClients(user.id);
      const res = await tasks.tasks.insert({
        tasklist: tasklistId,
        requestBody: body
      });

      await fetchAndCacheAllGoogleCalData(user.id);

      return c.json<SuccessResponse<tasks_v1.Schema$Task>>({
        success: true,
        message: "Task created",
        data: res.data
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .put("/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");
      const body = (await c.req.json()) as Partial<tasks_v1.Schema$Task>;
      const tasklistId = c.req.query("tasklistId");
      if (!tasklistId) throw new Error("tasklistId is required");

      const { tasks } = await getGoogleClients(user.id);
      const res = await tasks.tasks.patch({
        tasklist: tasklistId,
        task: id,
        requestBody: body
      });

      await fetchAndCacheAllGoogleCalData(user.id);

      return c.json<SuccessResponse<tasks_v1.Schema$Task>>({
        success: true,
        message: "Task updated",
        data: res.data
      });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  })
  .delete("/:id", async (c) => {
    try {
      const user = c.get("user") as User;
      const id = c.req.param("id");
      const tasklistId = c.req.query("tasklistId");
      if (!tasklistId) throw new Error("tasklistId is required");

      const { tasks } = await getGoogleClients(user.id);
      await tasks.tasks.delete({ tasklist: tasklistId, task: id });

      await fetchAndCacheAllGoogleCalData(user.id);

      return c.json<SuccessResponse<null>>({ success: true, message: "Task deleted", data: null });
      // biome-ignore lint:
    } catch (err: any) {
      return c.json<ErrorResponse>({ success: false, message: err.message });
    }
  });

export default app;
