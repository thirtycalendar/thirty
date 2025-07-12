import { z } from "zod";

export const holidaySchema = z.object({
  country: z.string().min(1, { message: "Country name is required" }),
  countryCode: z.string().min(1, { message: "Country code is required" })
});
