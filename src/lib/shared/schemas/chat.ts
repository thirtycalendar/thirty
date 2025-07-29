import { z } from "zod";

export const chatSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .describe("The name or title of the chat.")
});
