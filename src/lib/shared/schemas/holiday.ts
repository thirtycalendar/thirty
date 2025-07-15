import { z } from "zod";

export const hdCountrySchema = z.object({
  id: z.string().min(1, { message: "Country id is required" })
});
