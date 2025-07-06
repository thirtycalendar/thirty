import { z } from "zod";

import { Source, TaskStatus } from "../constants";

export const taskSchema = z.object({
  externalId: z.string().nullable(),
  source: z.enum(Source).default("local"),

  name: z.string().min(1, { message: "Name is required" }),
  notes: z.string().nullable(),
  colorId: z.string(),
  due: z.string().min(1, { message: "Start date is required" }),
  status: z.enum(TaskStatus).default("pending")
});
