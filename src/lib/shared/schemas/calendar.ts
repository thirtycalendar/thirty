import { z } from "zod";

import { Color, Source } from "../constants";

export const calendarSchema = z.object({
  externalId: z
    .string()
    .nullable()
    .describe("Optional external ID if synced from another service."),
  source: z.enum(Source).describe("The source of the calendar (e.g., 'google', 'local')."),

  name: z.string().min(1, { message: "Name is required" }).describe("The name of the calendar."),
  color: z.enum(Color).describe("The display color for the calendar events."),
  timezone: z
    .string()
    .min(1, { message: "Timezone is required" })
    .describe("The timezone of the calendar, e.g., 'Asia/Yangon'."),
  isPrimary: z.boolean().describe("Indicates if this is the user's primary calendar.")
});
