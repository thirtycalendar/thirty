import { z } from "zod";

export const holidaySchema = z.object({
  id: z.string().min(1, { message: "Id is required" }),
  colorId: z.string().min(1, { message: "Color id is required" }),
  countryName: z.string().min(1, { message: "Country name is required" }),
  countryCode: z.string().min(1, { message: "Country code is required" })
});
