import { tool } from "ai";
import z from "zod";

import { calendarSchema } from "$lib/shared/schemas/calendar";
import type { CalendarForm } from "$lib/shared/types";

import { calendarService } from "../../services/calendar";

export function createCalendarTools(userId: string) {
  return {
    getAllCalendars: tool({
      description:
        "Retrieve all calendars owned by the user. Use this when you need to show or pick from the user's calendars.",
      parameters: z.object({}),
      execute: async () => calendarService.getAll(userId)
    }),

    getCalendar: tool({
      description:
        "Retrieve detailed information about a specific calendar using its ID. Use this when you know the calendar ID and need its details (e.g., name, color, settings).",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the calendar to retrieve.")
        })
        .strict(),
      execute: async ({ id }) => calendarService.get(id)
    }),

    createCalendar: tool({
      description:
        "Create a new calendar for the user. Provide all required calendar details such as name, color, description, and other metadata.",
      parameters: calendarSchema.describe(
        "The full data needed to create a new calendar (e.g., name, description, color)."
      ),
      execute: async (data: CalendarForm) => calendarService.create(userId, data)
    }),

    updateCalendar: tool({
      description:
        "Update an existing calendar's details by providing its ID and the new data (e.g., name, color, description). Use this when modifying an existing calendar.",
      parameters: calendarSchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the calendar to update.")
        })
        .describe("Calendar update data, including the calendar ID."),
      execute: async ({ id, ...data }: CalendarForm & { id: string }) =>
        calendarService.update(id, data)
    }),

    deleteCalendar: tool({
      description:
        "Permanently delete a calendar by its ID. Use this when the user wants to remove a calendar completely.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the calendar to delete.")
        })
        .strict(),
      execute: async ({ id }) => calendarService.delete(id)
    })
  };
}
