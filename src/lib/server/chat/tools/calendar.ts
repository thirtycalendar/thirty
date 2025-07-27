import { tool } from "ai";
import z from "zod";

import { calendarSchema } from "$lib/shared/schemas/calendar";
import type { CalendarForm } from "$lib/shared/types";

import { calendarService } from "../../services/calendar";

export function createCalendarTools(userId: string) {
  return {
    searchCalendars: tool({
      description:
        "Retrieve a list of the user's calendars based on a natural language search query. Use this to find calendars matching a user's description, e.g., 'my work calendars' or 'personal events'. Returns an array of calendar objects.",
      parameters: z.object({
        query: z
          .string()
          .min(1)
          .describe(
            "The natural language search query for calendars (e.g., 'work', 'family', 'shared calendars')."
          ),
        limit: z
          .number()
          .min(1)
          .max(50)
          .default(10)
          .describe("The maximum number of calendars to return in the search result.")
      }),
      execute: async ({ query, limit }) => {
        try {
          const calendars = await calendarService.search(userId, query, limit);

          return { calendars: calendars || [] };
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
        "Get detailed information about a single calendar using its unique ID. This is useful when you have a calendar ID and need to fetch its specific properties like name, color, or subscription details. Only use if the calendar ID is known.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique identifier of the calendar to retrieve.")
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
        "Create a new calendar. This tool requires all necessary calendar details such as a name, and optionally a description and color. Use this when the user explicitly asks to 'create a new calendar' and provides sufficient details.",
      parameters: calendarSchema.describe(
        "An object containing the full data to create a new calendar, including its name, and optional description and color."
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
        "Modify an existing calendar's details. This tool takes the calendar's unique ID and the fields to update (e.g., change its name, color, or description). Use this when the user wants to 'rename a calendar' or 'change a calendar's color'.",
      parameters: calendarSchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the calendar to update.")
        })
        .describe(
          "An object containing the calendar ID and the specific fields to update (e.g., 'name', 'description', 'color')."
        ),
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
        "Permanently delete a single calendar using its unique ID. Only use this when the user clearly states they want to 'delete a calendar' and provides the specific calendar ID or enough context to infer it.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the calendar to be deleted.")
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
        "Permanently delete ALL calendars associated with the current user. This action is irreversible. Only use this tool if the user explicitly confirms they want to 'delete all my calendars' or 'clear all calendar data'. Always seek explicit confirmation before executing.",
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
