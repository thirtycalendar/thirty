import { z } from "zod";

import { Color } from "../constants";
import { dateYYYYMMDD } from "./utils";

export const birthdaySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dob: dateYYYYMMDD,
  color: z.enum(Color),
  note: z.string().nullable()
});
