import { z } from "zod";

export const eventSchema = z.object({
  calendarId: z.string().min(1, { message: "Calendar ID is required" }),
  summary: z.string().min(1, { message: "Summary is required" }),
  description: z.string().nullable().optional(),
  color: z.string().min(1, { message: "Color is required" }),
  bgColor: z.string().min(1, { message: "Background color is required" }),
  startDateTime: z.string().min(1, { message: "Start date is required" }),
  startTimeZone: z.string().min(1, { message: "Start time zone is required" }),
  endDateTime: z.string().min(1, { message: "End date is required" }),
  endTimeZone: z.string().min(1, { message: "End time zone is required" })
});
