import { tool } from "ai";
import z from "zod";

import { birthdaySchema } from "$lib/shared/schemas/birthday";
import type { BirthdayForm } from "$lib/shared/types";

import { birthdayService } from "../../services/birthday";

export function createBirthdayTools(userId: string) {
  return {
    searchBirthdays: tool({
      description:
        "Perform semantic search on user's birthdays using a natural language query (e.g., 'date of a specific birthday').",
      parameters: z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10)
      }),
      execute: async ({ query, limit }) => birthdayService.search(userId, query, limit)
    }),

    getBirthday: tool({
      description:
        "Get detailed information about a specific birthday by its unique ID. Use this when you know the birthday ID and need details such as name and birthdate.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the birthday to retrieve.")
        })
        .strict(),
      execute: async ({ id }) => birthdayService.get(id)
    }),

    createBirthday: tool({
      description:
        "Create a new birthday entry for the user. Provide all necessary details like name and birthdate.",
      parameters: birthdaySchema.describe(
        "Complete data needed to create a new birthday record (e.g., name, birthdate)."
      ),
      execute: async (data: BirthdayForm) => birthdayService.create(userId, data)
    }),

    updateBirthday: tool({
      description:
        "Update an existing birthday by its ID with new data. Use this to modify birthday details like name or date.",
      parameters: birthdaySchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the birthday to update.")
        })
        .describe("Birthday update data, including the birthday ID."),
      execute: async ({ id, ...data }: BirthdayForm & { id: string }) =>
        birthdayService.update(id, data)
    }),

    deleteBirthday: tool({
      description:
        "Permanently delete a birthday entry by its unique ID. Use this to remove a birthday record completely.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the birthday to delete.")
        })
        .strict(),
      execute: async ({ id }) => birthdayService.delete(id)
    })
  };
}
