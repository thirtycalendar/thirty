// src/lib/server/ai/tools/birthday.ts
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
        try {
          const birthdays = await birthdayService.search(userId, query, limit);

          if (!birthdays) {
            console.warn(`[searchBirthdays Tool] birthdayService.search returned null/undefined.`);
            return { birthdays: [] };
          }

          const result = { birthdays };

          return result;
        } catch (error) {
          console.error(`[searchBirthdays Tool] Error during execution:`, error);
          return {
            error: `Failed to search birthdays: ${error instanceof Error ? error.message : String(error)}`
          };
        }
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
        try {
          const birthday = await birthdayService.get(id);

          return { birthday };
        } catch (error) {
          console.error(`[getBirthday Tool] Error during execution:`, error);
          return {
            error: `Failed to get birthday: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    createBirthday: tool({
      description:
        "Create a new birthday entry for the user. Provide all necessary details like name and bod.",
      parameters: birthdaySchema.describe(
        "Complete data needed to create a new birthday record (e.g., name, dob)."
      ),
      execute: async (data: BirthdayForm) => {
        try {
          const birthday = await birthdayService.create(userId, data);
          return { birthday };
        } catch (error) {
          console.error(`[createBirthday Tool] Error during execution:`, error);
          return {
            error: `Failed to create birthday: ${error instanceof Error ? error.message : String(error)}`
          };
        }
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
        try {
          const birthday = await birthdayService.update(id, data);
          return { birthday };
        } catch (error) {
          console.error(`[updateBirthday Tool] Error during execution:`, error);
          return {
            error: `Failed to update birthday: ${error instanceof Error ? error.message : String(error)}`
          };
        }
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
        try {
          await birthdayService.delete(id);
          return { success: true, message: `Birthday ${id} deleted successfully.` };
        } catch (error) {
          console.error(`[deleteBirthday Tool] Error during execution:`, error);
          return {
            error: `Failed to delete birthday: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    deleteAllBirthdays: tool({
      description:
        "Permanently delete all birthday entries associated with the current user. Use this to remove all birthday data for a user.",
      parameters: z.object({}).strict(),
      execute: async () => {
        try {
          await birthdayService.deleteAll(userId);
          return {
            success: true,
            message: `All birthdays for user ${userId} deleted successfully.`
          };
        } catch (error) {
          console.error(`[deleteAllBirthdays Tool] Error during execution:`, error);
          return {
            error: `Failed to delete all birthdays: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    })
  };
}
