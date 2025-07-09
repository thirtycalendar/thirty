import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { getValidTimeZone } from "$lib/shared/utils/timezone";
import type { Event } from "$lib/shared/types";

export function getEventDateObjects(
  event: Event,
  includeTimezone = true
): { start: Date; end: Date } {
  const userTimezone = getValidTimeZone();
  const eventTimezone = getValidTimeZone(event.timezone);

  if (event.allDay) {
    const startUtc = fromZonedTime(`${event.startDate}T00:00:00`, eventTimezone);
    const endUtc = fromZonedTime(`${event.endDate}T23:59:59.999`, eventTimezone);

    if (includeTimezone) {
      return {
        start: toZonedTime(startUtc, userTimezone),
        end: toZonedTime(endUtc, userTimezone)
      };
    } else {
      return { start: startUtc, end: endUtc };
    }
  } else {
    const startUtc = fromZonedTime(`${event.startDate}T${event.startTime}`, eventTimezone);
    const endUtc = fromZonedTime(`${event.endDate}T${event.endTime}`, eventTimezone);

    if (includeTimezone) {
      return {
        start: toZonedTime(startUtc, userTimezone),
        end: toZonedTime(endUtc, userTimezone)
      };
    } else {
      return { start: startUtc, end: endUtc };
    }
  }
}

export function formatEventTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "h:mm")} - ${format(end, "h:mm a")}`;
}
