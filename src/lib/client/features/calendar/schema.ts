import { z } from "zod";

import { EventStatus } from "$lib/types";

export const eventSchema = z.object({
  calendarId: z.string().min(1, { message: "Calendar ID is required" }),

  name: z.string().min(1, { message: "Name is required" }),
  colorId: z.string().min(1, { message: "Color Id is required" }),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  start: z.string().min(1, { message: "Start date is required" }),
  end: z.string().min(1, { message: "Start time is required" }),
  allDay: z.boolean().default(false),
  status: z.enum(EventStatus).optional()
});
