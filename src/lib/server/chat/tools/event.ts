import { tool } from "ai";
import z from "zod";

import { eventSchema } from "$lib/shared/schemas/event";
import type { EventForm } from "$lib/shared/types";

import { eventService } from "../../services/event";

export function createEventTools(userId: string) {
  return {
    searchEvents: tool({
      description:
        "Retrieve a list of the user's events based on a natural language search query. Use this to find events matching criteria like 'meetings next week', 'my personal events', or 'events in July'. Returns an array of event objects.",
      inputSchema: z.object({
        query: z
          .string()
          .min(1)
          .describe(
            "The natural language search query for events (e.g., 'upcoming appointments', 'past meetings', 'events with John')."
          ),
        limit: z
          .number()
          .min(1)
          .max(50)
          .default(10)
          .describe("The maximum number of events to return in the search result.")
      }),
      execute: async ({ query, limit }) => {
        try {
          const events = await eventService.search(userId, query, limit);

          return { events: events || [] };
        } catch (error) {
          console.error(`[searchEvents Tool] Error during execution:`, error);
          return {
            error: `Failed to search events: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    getEvent: tool({
      description:
        "Get detailed information about a single event using its unique ID. This is useful when you have an event ID and need to fetch its specific properties like title, start/end times, location, or description. Only use if the event ID is known.",
      inputSchema: z
        .object({
          id: z.string().min(1).describe("The unique identifier of the event to retrieve.")
        })
        .strict(),
      execute: async ({ id }) => {
        try {
          const event = await eventService.get(id);
          return { event };
        } catch (error) {
          console.error(`[getEvent Tool] Error during execution:`, error);
          return {
            error: `Failed to get event: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    createEvent: tool({
      description:
        "Create a new event. This tool requires all necessary event details such as title, start and end times, and optionally a location and description. Use this when the user explicitly asks to 'create a new event' and provides sufficient details.",
      inputSchema: eventSchema.describe(
        "An object containing the complete data needed to create a new event, including its title, start time, end time, and optional location and description."
      ),
      execute: async (data: EventForm) => {
        try {
          const event = await eventService.create(userId, data);
          return { event };
        } catch (error) {
          console.error(`[createEvent Tool] Error during execution:`, error);
          return {
            error: `Failed to create event: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    updateEvent: tool({
      description:
        "Modify an existing event's details. This tool takes the event's unique ID and the fields to update (e.g., change its title, time, or location). Use this when the user wants to 'reschedule a meeting' or 'change an event's location'.",
      inputSchema: eventSchema
        .extend({
          id: z.string().min(1).describe("The unique ID of the event to update.")
        })
        .describe(
          "An object containing the event ID and the specific fields to update (e.g., 'title', 'startTime', 'location')."
        ),
      execute: async ({ id, ...data }: EventForm & { id: string }) => {
        try {
          const event = await eventService.update(id, data);
          return { event };
        } catch (error) {
          console.error(`[updateEvent Tool] Error during execution:`, error);
          return {
            error: `Failed to update event: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    deleteEvent: tool({
      description:
        "Permanently delete a single event using its unique ID. Only use this when the user clearly states they want to 'delete an event' and provides the specific event ID or enough context to infer it.",
      inputSchema: z
        .object({
          id: z.string().min(1).describe("The unique ID of the event to be deleted.")
        })
        .strict(),
      execute: async ({ id }) => {
        try {
          await eventService.delete(id);
          return { success: true, message: `Event ${id} deleted successfully.` };
        } catch (error) {
          console.error(`[deleteEvent Tool] Error during execution:`, error);
          return {
            error: `Failed to delete event: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    }),

    deleteAllEvents: tool({
      description:
        "Permanently delete ALL events associated with the current user. This action is irreversible. Only use this tool if the user explicitly confirms they want to 'delete all my events' or 'clear all event data'. Always seek explicit confirmation before executing.",
      inputSchema: z.object({}).strict(),
      execute: async () => {
        try {
          await eventService.deleteAll(userId);
          return { success: true, message: `All events for user ${userId} deleted successfully.` };
        } catch (error) {
          console.error(`[deleteAllEvents Tool] Error during execution:`, error);
          return {
            error: `Failed to delete all events: ${error instanceof Error ? error.message : String(error)}`
          };
        }
      }
    })
  };
}
