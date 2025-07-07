import { z } from "zod";

export const holidaySchema = z.object({
  countryName: z.string().min(1, { message: "Country name is required" })
});
