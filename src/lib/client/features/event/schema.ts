import { z } from "zod";

import { EventStatus, Source } from "$lib/types";

export const eventSchema = z.object({
  calendarId: z.string().min(1, { message: "Calendar ID is required" }),
  externalId: z.string().nullable(),
  source: z.enum(Source).default("local"),

  name: z.string().min(1, { message: "Name is required" }),
  colorId: z.string().min(1, { message: "Color Id is required" }),
  description: z.string().nullable(),
  location: z.string().nullable(),
  start: z.string().min(1, { message: "Start date is required" }),
  end: z.string().min(1, { message: "Start time is required" }),
  timezone: z.string().min(1, { message: "Timezone Id is required" }).default("UTC"),
  allDay: z.boolean().default(false),
  status: z.enum(EventStatus).default("confirmed")
});
