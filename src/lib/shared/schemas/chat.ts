import { z } from "zod";

export const chatSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  userId: z.string().min(1, { message: "UserId is required" })
});
