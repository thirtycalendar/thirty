import { z } from "zod";

import { Color, EventStatus, Source } from "../constants";
import { dateYYYYMMDD, timeHHMMSS } from "./utils";

export const eventSchema = z.object({
  calendarId: z.string().min(1, { message: "Calendar ID is required" }),
  externalId: z.string().nullable(),
  source: z.enum(Source),

  name: z.string().min(1, { message: "Name is required" }),
  color: z.enum(Color),
  description: z.string().nullable(),
  location: z.string().nullable(),

  startDate: dateYYYYMMDD,
  startTime: timeHHMMSS,
  endDate: dateYYYYMMDD,
  endTime: timeHHMMSS,

  timezone: z.string().min(1, { message: "Timezone Id is required" }),
  allDay: z.boolean(),
  status: z.enum(EventStatus)
});
