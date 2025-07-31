import { z } from "zod";

export const chatSchema = z.object({
  id: z.string(),
  userId: z.string(),

  name: z.string().min(1, { message: "Name is required" })
});
