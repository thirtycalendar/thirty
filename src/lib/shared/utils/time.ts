import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import type { Event } from "$lib/shared/types";

export function getEventDateObjects(event: Event): { start: Date; end: Date } {
  const timeZone = event.timezone;

  if (event.allDay) {
    const start = toZonedTime(`${event.startDate}T00:00:00`, timeZone);
    const end = toZonedTime(`${event.endDate}T23:59:59.999`, timeZone);
    return { start, end };
  }

  const start = toZonedTime(`${event.startDate}T${event.startTime}`, timeZone);
  const end = toZonedTime(`${event.endDate}T${event.endTime}`, timeZone);
  return { start, end };
}

export function formatEventTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "h:mm")} - ${format(end, "h:mm a")}`;
}
