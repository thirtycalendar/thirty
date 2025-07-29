import { z } from "zod";

import { Source, TaskStatus } from "../constants";

export const taskSchema = z.object({
  externalId: z
    .string()
    .nullable()
    .describe("Optional external ID if synced from another service."),
  source: z
    .enum(Source)
    .default("local")
    .describe("The source of the task (e.g., 'google', 'local'). Defaults to 'local'."),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .describe("The name or title of the task."),
  notes: z.string().nullable().describe("Any additional notes or details for the task."),
  colorId: z.string().describe("The ID referencing a color for the task."),
  due: z
    .string()
    .min(1, { message: "Start date is required" })
    .describe("The due date of the task in YYYY-MM-DD format."),
  status: z
    .enum(TaskStatus)
    .default("pending")
    .describe(
      "The current status of the task (e.g., 'pending', 'completed'). Defaults to 'pending'."
    )
});
