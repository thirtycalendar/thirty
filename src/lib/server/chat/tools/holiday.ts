// src/lib/server/ai/tools/holiday.ts
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
        "Perform a search over the user's subscribed holiday countries to find specific countries relevant to a query. This can help identify which of the user's subscribed countries might be relevant for a given context.",
      parameters: z.object({
        query: z
          .string()
          .min(1)
          .describe(
            "A natural language query to find relevant subscribed countries (e.g., 'countries in Europe', 'countries with major holidays soon')."
          ),
        limit: z
          .number()
          .min(1)
          .max(50)
          .default(10)
          .describe("The maximum number of country results to return.")
      }),
      execute: async ({ query, limit }) => {
        try {
          const holidayCountries = await holidayService.searchCountries(
            query,
            userId,
            undefined,
            limit
          );

          if (!holidayCountries) {
            console.warn(
              `[searchHolidayCountries Tool] holidayService.searchCountries returned null/undefined.`
            );
            return { holidayCountries: [] };
          }

          const result = { holidayCountries };

          return result;
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
        "Add a new holiday country subscription for the user by its unique ID (e.g., 'US' for United States).",
      parameters: holidayCountryFormSchema.describe("The ID of the country to subscribe to."),
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
      description: "Remove an existing holiday country subscription for the user by its unique ID.",
      parameters: z
        .object({
          countryId: z.string().min(1).describe("The unique ID of the country to unsubscribe from.")
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
        "Clear all cached holiday data and subscribed countries for the user. This will force a re-fetch of holiday data on next request.",
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
