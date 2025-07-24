import { tool } from "ai";
import z from "zod";

import { birthdaySchema } from "$lib/shared/schemas/birthday";
import type { BirthdayForm } from "$lib/shared/types";

import { birthdayService } from "../../services/birthday";

export function createBirthdayTools(userId: string) {
  return {
    searchBirthdays: tool({
      description:
        "Perform semantic search on user's birthdays using a natural language query (e.g., 'date of the user's birthday').",
      parameters: z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10)
      }),
      execute: async ({ query, limit }) => {
        const birthdays = await birthdayService.search(userId, query, limit);
        return { birthdays };
      }
    }),

    getBirthday: tool({
      description:
        "Get detailed information about a specific birthday by its unique ID. Use this when you know the birthday ID and need details such as name and birthdate.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the birthday to retrieve.")
        })
        .strict(),
      execute: async ({ id }) => {
        const birthday = await birthdayService.get(id);
        return { birthday };
      }
    }),

    createBirthday: tool({
      description:
        "Create a new birthday entry for the user. Provide all necessary details like name and bod.",
      parameters: birthdaySchema.describe(
        "Complete data needed to create a new birthday record (e.g., name, dob)."
      ),
      execute: async (data: BirthdayForm) => {
        const birthday = await birthdayService.create(userId, data);
        return { birthday };
      }
    }),

    updateBirthday: tool({
      description:
        "Update an existing birthday by its ID with new data. Use this to modify birthday details like name or date.",
      parameters: birthdaySchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the birthday to update.")
        })
        .describe("Birthday update data, including the birthday ID."),
      execute: async ({ id, ...data }: BirthdayForm & { id: string }) => {
        const birthday = await birthdayService.update(id, data);
        return { birthday };
      }
    }),

    deleteBirthday: tool({
      description:
        "Permanently delete a birthday entry by its unique ID. Use this to remove a birthday record completely.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the birthday to delete.")
        })
        .strict(),
      execute: async ({ id }) => {
        await birthdayService.delete(id);
        return { success: true, message: `Birthday ${id} deleted successfully.` };
      }
    })
  };
}
