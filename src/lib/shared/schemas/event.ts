import { z } from "zod";

import { Colors, EventStatuses, Sources } from "../constants";
import { dateYYYYMMDD, timeHHMMSS } from "./utils";

export const eventSchema = z.object({
  calendarId: z
    .string()
    .min(1, { message: "Calendar ID is required" })
    .describe("The ID of the calendar this event belongs to."),
  externalId: z
    .string()
    .nullable()
    .describe("Optional external ID if synced from another service."),
  source: z.enum(Sources).describe("The source of the event (e.g., 'google', 'local')."),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .describe("The name or title of the event."),
  color: z.enum(Colors).describe("The display color for this specific event."),
  description: z.string().nullable().describe("A detailed description of the event."),
  location: z.string().nullable().describe("The physical location of the event."),
  startDate: dateYYYYMMDD.describe("The start date of the event in YYYY-MM-DD format."),
  startTime: timeHHMMSS.describe("The start time of the event in HH:MM:SS format."),
  endDate: dateYYYYMMDD.describe("The end date of the event in YYYY-MM-DD format."),
  endTime: timeHHMMSS.describe("The end time of the event in HH:MM:SS format."),
  timezone: z
    .string()
    .min(1, { message: "Timezone is required" })
    .describe("The timezone of the event, e.g., 'Asia/Yangon'."),
  allDay: z.boolean().describe("Indicates if the event lasts all day."),
  status: z
    .enum(EventStatuses)
    .describe("The status of the event (e.g., 'confirmed', 'cancelled').")
});
