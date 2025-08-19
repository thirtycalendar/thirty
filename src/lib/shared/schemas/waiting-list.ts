import z from "zod";

export const waitingListSchema = z.object({
  email: z.email({ message: "Invalid email address" }).min(1, { message: "Email is required" })
});
