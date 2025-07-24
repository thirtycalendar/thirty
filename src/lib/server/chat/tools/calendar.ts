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
      execute: async ({ query, limit }) => calendarService.search(userId, query, limit)
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
