import { z } from "zod";

export const hdCountrySchema = z.object({
  id: z
    .string()
    .min(1, { message: "Country id is required" })
    .describe("The unique ID of the country (e.g., 'US', 'GB').")
});
