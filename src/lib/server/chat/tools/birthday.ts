import { tool } from "ai";
import z from "zod";

import { birthdaySchema } from "$lib/shared/schemas/birthday";
import type { BirthdayForm } from "$lib/shared/types";

import { birthdayService } from "../../services/birthday";

export function createBirthdayTools(userId: string) {
  return {
    searchBirthdays: tool({
      description:
        "Retrieve a list of the user's birthday entries based on a natural language search query. Use this to find birthdays matching criteria like 'birthdays in August', 'friends' birthdays', or 'upcoming birthdays'. Returns an array of birthday objects.",
      inputSchema: z.object({
        query: z
          .string()
          .min(1)
          .describe(
            "The natural language search query for birthdays (e.g., 'family birthdays', 'birthdays next month')."
          ),
        limit: z
          .number()
          .min(1)
          .max(50)
          .default(10)
          .describe("The maximum number of birthday entries to return in the search result.")
      }),
      execute: async ({ query, limit }) => {
        try {
          const birthdays = await birthdayService.search(userId, query, limit);

          return { birthdays: birthdays || [] };
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
        "Get detailed information about a single birthday entry using its unique ID. This is useful when you have a birthday ID and need to fetch its specific properties like name or birthdate. Only use if the birthday ID is known.",
      inputSchema: z
        .object({
          id: z.string().min(1).describe("The unique identifier of the birthday entry to retrieve.")
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
        "Create a new birthday entry. This tool requires the person's name and their date of birth (DOB). Use this when the user explicitly asks to 'add a new birthday' and provides the necessary details.",
      inputSchema: birthdaySchema.describe(
        "An object containing the complete data needed to create a new birthday record, including the person's name and date of birth."
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
        "Modify an existing birthday entry's details. This tool takes the birthday's unique ID and the fields to update (e.g., change the name or date of birth). Use this when the user wants to 'update someone's birthday' or 'correct a birthdate'.",
      inputSchema: birthdaySchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the birthday entry to update.")
        })
        .describe(
          "An object containing the birthday ID and the specific fields to update (e.g., 'name', 'dob')."
        ),
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
        "Permanently delete a single birthday entry using its unique ID. Only use this when the user clearly states they want to 'delete a birthday' and provides the specific birthday ID or enough context to infer it.",
      inputSchema: z
        .object({
          id: z.string().min(1).describe("The unique ID of the birthday entry to be deleted.")
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
        "Permanently delete ALL birthday entries associated with the current user. This action is irreversible. Only use this tool if the user explicitly confirms they want to 'delete all my birthdays' or 'clear all birthday data'. Always seek explicit confirmation before executing.",
      inputSchema: z.object({}).strict(),
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
