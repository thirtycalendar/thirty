import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import type { Event } from "$lib/shared/types";

export function getEventDateObjects(
  event: Event,
  includeTimezone = true
): { start: Date; end: Date } {
  if (event.allDay) {
    if (includeTimezone) {
      return {
        start: toZonedTime(`${event.startDate}T00:00:00`, event.timezone),
        end: toZonedTime(`${event.endDate}T23:59:59.999`, event.timezone)
      };
    } else {
      return {
        start: new Date(`${event.startDate}T00:00:00Z`),
        end: new Date(`${event.endDate}T23:59:59.999Z`)
      };
    }
  } else {
    if (includeTimezone) {
      return {
        start: toZonedTime(`${event.startDate}T${event.startTime}`, event.timezone),
        end: toZonedTime(`${event.endDate}T${event.endTime}`, event.timezone)
      };
    } else {
      return {
        start: new Date(`${event.startDate}T${event.startTime}`),
        end: new Date(`${event.endDate}T${event.endTime}`)
      };
    }
  }
}

export function formatEventTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "h:mm")} - ${format(end, "h:mm a")}`;
}
