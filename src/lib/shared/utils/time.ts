import { format } from "date-fns";

import type { Event } from "$lib/shared/types";

export function getEventDateObjects(event: Event): { start: Date; end: Date } {
  if (event.allDay) {
    // Represent all-day events as starting at midnight UTC on the start date
    // and ending at the very end of the end date in UTC.
    const start = new Date(`${event.startDate}T00:00:00Z`);
    const end = new Date(`${event.endDate}T23:59:59.999Z`);
    return { start, end };
  }

  const start = new Date(`${event.startDate}T${event.startTime}Z`);
  const end = new Date(`${event.endDate}T${event.endTime}Z`);
  return { start, end };
}

/**
 * Formats a single time for display (e.g., in a compact event block).
 * Displays in the user's local time.
 */
export function formatEventTime(date: Date): string {
  return format(date, "h:mm a");
}

/**
 * Formats a time range for display.
 * Displays in the user's local time.
 */
export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "h:mm")} - ${format(end, "h:mm a")}`;
}
