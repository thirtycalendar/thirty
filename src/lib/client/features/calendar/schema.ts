import { z } from "zod";

import { Source } from "$lib/types";

export const calendarSchema = z.object({
  externalId: z.string().nullable(),
  source: z.enum(Source).default("local"),

  name: z.string().min(1, { message: "Name is required" }),
  colorId: z.string().min(1, { message: "Color Id is required" }),
  timezone: z.string().min(1, { message: "Timezone Id is required" }).default("UTC"),
  isPrimary: z.boolean().default(false)
});
