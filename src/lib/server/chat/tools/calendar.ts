import { tool } from "ai";
import z from "zod";

import { calendarSchema } from "$lib/shared/schemas/calendar";
import type { CalendarForm } from "$lib/shared/types";

import { calendarService } from "../../services/calendar";

export function createCalendarTools(userId: string) {
  return {
    searchCalendars: tool({
      description:
        "Perform semantic search on user's calendars using a natural language query (e.g., 'list of calendars').",
      parameters: z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10)
      }),
      execute: async ({ query, limit }) => {
        try {
          const calendars = await calendarService.search(userId, query, limit);

          if (!calendars) {
            console.warn(`[searchCalendars Tool] calendarService.search returned null/undefined.`);
            return { calendars: [] };
          }

          const result = { calendars };

          return result;
        } catch (error) {
          console.error(`[searchCalendars Tool] Error during execution:`, error);
          return {
            error: `Failed to search calendars: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    getCalendar: tool({
      description:
        "Retrieve detailed information about a specific calendar using its ID. Use this when you know the calendar ID and need its details (e.g., name, color, settings).",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the calendar to retrieve.")
        })
        .strict(),
      execute: async ({ id }) => {
        try {
          const calendar = await calendarService.get(id);
          return { calendar };
        } catch (error) {
          console.error(`[getCalendar Tool] Error during execution:`, error);
          return {
            error: `Failed to get calendar: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    createCalendar: tool({
      description:
        "Create a new calendar for the user. Provide all required calendar details such as name, color, description, and other metadata.",
      parameters: calendarSchema.describe(
        "The full data needed to create a new calendar (e.g., name, description, color)."
      ),
      execute: async (data: CalendarForm) => {
        try {
          const calendar = await calendarService.create(userId, data);
          return { calendar };
        } catch (error) {
          console.error(`[createCalendar Tool] Error during execution:`, error);
          return {
            error: `Failed to create calendar: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    updateCalendar: tool({
      description:
        "Update an existing calendar's details by providing its ID and the new data (e.g., name, color, description). Use this when modifying an existing calendar.",
      parameters: calendarSchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the calendar to update.")
        })
        .describe("Calendar update data, including the calendar ID."),
      execute: async ({ id, ...data }: CalendarForm & { id: string }) => {
        try {
          const calendar = await calendarService.update(id, data);
          return { calendar };
        } catch (error) {
          console.error(`[updateCalendar Tool] Error during execution:`, error);
          return {
            error: `Failed to update calendar: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    deleteCalendar: tool({
      description:
        "Permanently delete a calendar by its ID. Use this when the user wants to remove a calendar completely.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the calendar to delete.")
        })
        .strict(),
      execute: async ({ id }) => {
        try {
          await calendarService.delete(id);
          return { success: true, message: `Calendar ${id} deleted successfully.` };
        } catch (error) {
          console.error(`[deleteCalendar Tool] Error during execution:`, error);
          return {
            error: `Failed to delete calendar: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    deleteAllCalendars: tool({
      description:
        "Permanently delete all calendars associated with the current user. Use this when the user wants to remove all their calendar data.",
      parameters: z.object({}).strict(),
      execute: async () => {
        try {
          await calendarService.deleteAll(userId);
          return {
            success: true,
            message: `All calendars for user ${userId} deleted successfully.`
          };
        } catch (error) {
          console.error(`[deleteAllCalendars Tool] Error during execution:`, error);
          return {
            error: `Failed to delete all calendars: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    })
  };
}
