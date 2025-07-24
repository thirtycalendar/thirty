import { z } from "zod";

import { Color, Source } from "../constants";

export const calendarSchema = z.object({
  externalId: z.string().nullable(),
  source: z.enum(Source),

  name: z.string().min(1, { message: "Name is required" }),
  color: z.enum(Color),
  timezone: z.string().min(1, { message: "Timezone Id is required" }),
  isPrimary: z.boolean()
});
