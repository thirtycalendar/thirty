import { z } from "zod";

export const birthdaySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  colorId: z.string().min(1, { message: "Color Id is required" }),
  description: z.string().nullable()
});
