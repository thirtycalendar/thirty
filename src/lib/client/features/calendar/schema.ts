import { z } from "zod";

import { Source } from "$lib/types";

export const calendarSchema = z.object({
  externalId: z.string().nullable(),
  source: z.enum(Source).default("local"),

  name: z.string(),
  colorId: z.string(),
  timezone: z.string(),
  isPrimary: z.boolean()
});
