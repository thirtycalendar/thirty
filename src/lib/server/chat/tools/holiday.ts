import { tool } from "ai";
import z from "zod";

import type { HolidayCountryForm } from "$lib/shared/types";

import { holidayService } from "../../services/holiday";

export const holidayCountryFormSchema = z
  .object({
    id: z.string().min(1).describe("The unique ID of the country (e.g., 'US', 'GB').")
  })
  .strict();

export function createHolidayTools(userId: string) {
  return {
    searchHolidayCountries: tool({
      description:
        "Search for the user's subscribed holiday countries using a natural language query. This helps identify which countries the user is interested in for holiday information. Returns an array of subscribed holiday country objects.",
      parameters: z.object({
        query: z
          .string()
          .min(1)
          .describe(
            "A natural language query to find relevant subscribed holiday countries (e.g., 'European countries', 'countries I get holidays from')."
          ),
        limit: z
          .number()
          .min(1)
          .max(50)
          .default(10)
          .describe("The maximum number of holiday country results to return.")
      }),
      execute: async ({ query, limit }) => {
        try {
          const holidayCountries = await holidayService.searchCountries(
            query,
            userId,
            undefined,
            limit
          );

          return { holidayCountries: holidayCountries || [] };
        } catch (error) {
          console.error(`[searchHolidayCountries Tool] Error during execution:`, error);
          return {
            error: `Failed to search holiday countries: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    addHolidayCountry: tool({
      description:
        "Add a new holiday country subscription for the user by its unique country ID (e.g., 'US' for United States, 'GB' for Great Britain). Use this when the user wants to 'add holidays for a specific country'.",
      parameters: holidayCountryFormSchema.describe(
        "An object containing the unique ID of the country to subscribe to (e.g., 'US', 'DE', 'FR')."
      ),
      execute: async (data: HolidayCountryForm) => {
        try {
          const country = await holidayService.addCountry(userId, data);
          return { country };
        } catch (error) {
          console.error(`[addHolidayCountry Tool] Error during execution:`, error);
          return {
            error: `Failed to add holiday country: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    removeHolidayCountry: tool({
      description:
        "Remove an existing holiday country subscription for the user by its unique country ID. Use this when the user wants to 'stop receiving holidays for a country' or 'remove a country from my holiday list'.",
      parameters: z
        .object({
          countryId: z
            .string()
            .min(1)
            .describe("The unique ID of the country to unsubscribe from (e.g., 'US', 'DE', 'FR').")
        })
        .strict(),
      execute: async ({ countryId }) => {
        try {
          const removedCountry = await holidayService.removeCountry(userId, countryId);
          return {
            country: removedCountry,
            success: true,
            message: `Country ${countryId} removed successfully.`
          };
        } catch (error) {
          console.error(`[removeHolidayCountry Tool] Error during execution:`, error);
          return {
            error: `Failed to remove holiday country: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    clearHolidays: tool({
      description:
        "Clear all cached holiday data and all subscribed countries for the current user. This action will effectively reset all holiday preferences and cached data. Only use if the user explicitly confirms they want to 'clear all holiday settings' or 'reset my holiday data'. Always seek explicit confirmation before executing.",
      parameters: z.object({}).strict(),
      execute: async () => {
        try {
          await holidayService.clearCache(userId);
          return { success: true, message: "Holiday cache cleared successfully." };
        } catch (error) {
          console.error(`[clearHolidayCache Tool] Error during execution:`, error);
          return {
            error: `Failed to clear holiday cache: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    })
  };
}
