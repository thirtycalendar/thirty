import { tool } from "ai";
import z from "zod";

import { eventSchema } from "$lib/shared/schemas/event";
import type { EventForm } from "$lib/shared/types";

import { eventService } from "../../services/event";

export function createEventTools(userId: string) {
  return {
    getAllEvents: tool({
      description:
        "Retrieve all events owned by the user. Use this to list or pick from the user's events.",
      parameters: z.object({}).strict(),
      execute: async () => eventService.getAll(userId)
    }),

    getEvent: tool({
      description:
        "Retrieve detailed information about a specific event using its ID. Use this when you have an event ID and need full details such as title, time, and location.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the event to retrieve.")
        })
        .strict(),
      execute: async ({ id }) => eventService.get(id)
    }),

    createEvent: tool({
      description:
        "Create a new event for the user. Provide all necessary event details such as title, start and end times, location, and description.",
      parameters: eventSchema.describe(
        "The complete data needed to create a new event (e.g., title, start/end time, location)."
      ),
      execute: async (data: EventForm) => eventService.create(userId, data)
    }),

    updateEvent: tool({
      description:
        "Update an existing event by providing its ID and the new details. Use this to modify event information like time, title, or location.",
      parameters: eventSchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the event to update.")
        })
        .describe("Event update data, including the event ID."),
      execute: async ({ id, ...data }: EventForm & { id: string }) => eventService.update(id, data)
    }),

    deleteEvent: tool({
      description:
        "Permanently delete an event by its unique ID. Use this to remove an event completely.",
      parameters: z
        .object({
          id: z.string().min(1).describe("The unique ID of the event to delete.")
        })
        .strict(),
      execute: async ({ id }) => eventService.delete(id)
    })
  };
}
