import { z } from "zod";

import { dateYYYYMMDD } from "./utils";

export const birthdaySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dob: dateYYYYMMDD,
  colorId: z.string().min(1, { message: "Color Id is required" }),
  note: z.string().nullable()
});
