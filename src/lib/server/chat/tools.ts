import { tool } from "ai";
import z from "zod";

import { calendarSchema } from "$lib/shared/schemas/calendar";
import type { CalendarForm } from "$lib/shared/types";

import { calendarService } from "../services/calendar";

export function createCalendarTools(userId: string) {
  return {
    getAllCalendars: tool({
      description: "List all the calendars of a user",
      parameters: z.object({}),
      execute: async () => {
        return await calendarService.getAll(userId);
      }
    }),

    getCalendar: tool({
      description: "Get a specific calendar of a user by its ID",
      parameters: z.object({
        id: z.string().min(1).describe("ID of the calendar")
      }),
      execute: async ({ id }: { id: string }) => {
        return await calendarService.get(id);
      }
    }),

    createCalendar: tool({
      description: "Create a new calendar for the user",
      parameters: calendarSchema,
      execute: async (data: CalendarForm) => {
        return await calendarService.create(userId, data);
      }
    }),

    updateCalendar: tool({
      description: "Update a calendar by its ID and data",
      parameters: calendarSchema.extend({
        id: z.string().min(1).describe("ID of the calendar")
      }),
      execute: async ({ id, ...data }: CalendarForm & { id: string }) => {
        return await calendarService.update(id, data);
      }
    }),

    deleteCalendar: tool({
      description: "Delete a calendar by its ID",
      parameters: z.object({
        id: z.string().min(1).describe("ID of the calendar")
      }),
      execute: async ({ id }: { id: string }) => {
        return await calendarService.delete(id);
      }
    })
  };
}
