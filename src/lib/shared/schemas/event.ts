import { z } from "zod";

import { EventStatus, Source } from "../constants";

export const eventSchema = z.object({
  calendarId: z.string().min(1, { message: "Calendar ID is required" }),
  externalId: z.string().nullable(),
  source: z.enum(Source).default("local"),

  name: z.string().min(1, { message: "Name is required" }),
  colorId: z.string().min(1, { message: "Color Id is required" }),
  description: z.string().nullable(),
  location: z.string().nullable(),

  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" }),
  startTime: z
    .string()
    .regex(/^([0-1]?\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:mm)" }),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format (YYYY-MM-DD)" }),
  endTime: z
    .string()
    .regex(/^([0-1]?\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:mm)" }),

  timezone: z.string().min(1, { message: "Timezone Id is required" }).default("UTC"),
  allDay: z.boolean().default(false),
  status: z.enum(EventStatus).default("confirmed")
});
