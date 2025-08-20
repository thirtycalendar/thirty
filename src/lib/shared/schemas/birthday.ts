import { z } from "zod";

import { Colors } from "../constants";
import { dateYYYYMMDD } from "./utils";

export const birthdaySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .describe("The name of the person whose birthday it is."),
  dob: dateYYYYMMDD,
  color: z.enum(Colors).describe("The display color for the birthday."),
  note: z.string().nullable().describe("Any additional notes about the birthday.")
});
