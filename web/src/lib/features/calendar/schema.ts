import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  calendar: z.string().min(1, "Calendar is required"),
  date: z.string().refine((value) => !isNaN(Date.parse(value)), "Start Date must be a valid date"),
  timeFrom: z.string().min(1, "Starting time is required"),
  timeTo: z.string().min(1, "Ending time is required"),
  location: z.string().optional(),
  description: z.string().optional(),
  notify_in: z.string().optional()
});
