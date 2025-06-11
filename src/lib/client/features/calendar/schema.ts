import { z } from "zod";

export const eventSchema = z.object({
  calendarId: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  color: z.string(),
  bgColor: z.string(),
  startDateTime: z.string(),
  startTimeZone: z.string(),
  endDateTime: z.string(),
  endTimeZone: z.string()
});
