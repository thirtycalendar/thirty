import { z } from "zod";

export const eventSchema = z.object({
  id: z.string(),
  calendarId: z.string(),
  summary: z.string(),
  description: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  bgColor: z.string().nullable().optional(),
  organizer: z
    .object({
      displayName: z.string()
    })
    .optional(),
  start: z.object({
    dateTime: z.string().datetime(),
    timeZone: z.string()
  }),
  end: z.object({
    dateTime: z.string().datetime(),
    timeZone: z.string()
  }),
  reminders: z
    .object({
      useDefault: z.boolean().optional(),
      overrides: z
        .array(
          z.object({
            minutes: z.number().nullable().optional()
          })
        )
        .optional()
    })
    .optional(),
  eventType: z.string().optional()
});
