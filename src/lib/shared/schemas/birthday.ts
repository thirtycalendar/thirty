import { z } from "zod";

import { Color } from "../constants";
import { dateYYYYMMDD } from "./utils";

export const birthdaySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .describe("The name of the person whose birthday it is."),
  dob: dateYYYYMMDD.describe("The date of birth in YYYY-MM-DD format."),
  color: z.enum(Color).describe("The display color for the birthday."),
  note: z.string().nullable().describe("Any additional notes about the birthday.")
});
