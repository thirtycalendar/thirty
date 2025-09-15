import { writable } from "svelte/store";

import {
  differenceInMilliseconds,
  differenceInMinutes,
  format,
  isSameDay,
  isSameYear,
  isWithinInterval
} from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

import { toMs } from "$lib/shared/utils/ms";
import { getValidTimeZone } from "$lib/shared/utils/timezone";
import type { Event, EventChunk } from "$lib/shared/types";

export const draggedEventStart = writable<Date | null>(null);
export const draggedEventEnd = writable<Date | null>(null);

export function getVisibleEvents(events: Event[], start: Date, end: Date, unchecked: string[]) {
  const all: Event[] = [];
  const timed: Event[] = [];

  for (const event of events) {
    const isNotVisible = unchecked.includes(event.calendarId);
    if (isNotVisible) continue;

    const { start: eventStart, end: eventEnd } = getEventDateObjects(event);
    const isInRange =
      isWithinInterval(eventStart, { start, end }) ||
      isWithinInterval(eventEnd, { start, end }) ||
      (eventStart < start && eventEnd > end);

    if (!isInRange) continue;

    if (event.allDay) all.push(event);
    else timed.push(event);
  }

  return { allDayEvents: all, timedEvents: timed };
}

export function getEventDateObjects(event: Event): { start: Date; end: Date } {
  const eventTimezone = getValidTimeZone(event.timezone);

  if (event.allDay) {
    const startUtc = fromZonedTime(`${event.startDate}T00:00:00`, eventTimezone);
    const endUtc = fromZonedTime(`${event.endDate}T23:59:59`, eventTimezone);
    return { start: startUtc, end: endUtc };
  } else {
    const startUtc = fromZonedTime(`${event.startDate}T${event.startTime}`, eventTimezone);
    const endUtc = fromZonedTime(`${event.endDate}T${event.endTime}`, eventTimezone);
    return { start: startUtc, end: endUtc };
  }
}

export function formatEventTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, "h:mm")} - ${format(end, "h:mm a")}`;
}

export function calculateEventOffsets(chunks: EventChunk[]) {
  const offsets = new Map<EventChunk, number>();
  const dayChunksMap = new Map<string, EventChunk[]>();

  // Group chunks by day
  for (const chunk of chunks) {
    const dayKey = chunk.day ? chunk.day.toISOString() : "single-day";
    if (!dayChunksMap.has(dayKey)) dayChunksMap.set(dayKey, []);
    dayChunksMap.get(dayKey)!.push(chunk);
  }

  for (const [, dayChunks] of dayChunksMap) {
    // Sort by start time (natural order)
    dayChunks.sort((a, b) => a.start.getTime() - b.start.getTime());

    let i = 0;
    while (i < dayChunks.length) {
      const overlappingGroup: EventChunk[] = [dayChunks[i]];
      let groupEnd = dayChunks[i].end;
      let j = i + 1;

      // Collect overlapping events
      while (j < dayChunks.length && dayChunks[j].start < groupEnd) {
        overlappingGroup.push(dayChunks[j]);
        groupEnd = new Date(Math.max(groupEnd.getTime(), dayChunks[j].end.getTime()));
        j++;
      }

      // Sort overlapping group by duration (longest first), then start time
      overlappingGroup.sort((a, b) => {
        const durationA = a.end.getTime() - a.start.getTime();
        const durationB = b.end.getTime() - b.start.getTime();

        // Primary sort by duration (descending)
        if (durationB !== durationA) {
          return durationB - durationA;
        }

        // Secondary sort by start time (ascending)
        return a.start.getTime() - b.start.getTime();
      });

      overlappingGroup.forEach((chunk, index) => {
        offsets.set(chunk, index);
      });

      i = j;
    }
  }

  return offsets;
}

export function formatEventTimeDetails(event: Event, start: Date, end: Date) {
  const now = new Date();
  const showYear = !isSameYear(now, start) || !isSameYear(now, end);
  const formatString = event.allDay
    ? showYear
      ? "EEE, MMM d, yyyy"
      : "EEE, MMM d"
    : showYear
      ? "EEE, MMM d, yyyy · h:mm a"
      : "EEE, MMM d · h:mm a";

  const startFormatted = formatInTimeZone(start, event.timezone, formatString);

  if (event.allDay) {
    if (isSameDay(start, end)) return startFormatted;
    const endFormatted = formatInTimeZone(end, event.timezone, formatString);
    return `${startFormatted} - ${endFormatted}`;
  }

  if (isSameDay(start, end)) {
    const endFormatted = formatInTimeZone(end, event.timezone, "h:mm a");
    return `${startFormatted} - ${endFormatted}`;
  }

  const endFormatted = formatInTimeZone(end, event.timezone, formatString);
  return `${startFormatted} - ${endFormatted}`;
}

export function formatLocalTimeDetails(
  event: Event,
  start: Date,
  end: Date,
  sameTimezone: boolean
) {
  if (sameTimezone) return "";

  const now = new Date();
  const showYear = !isSameYear(now, start) || !isSameYear(now, end);
  const formatString = event.allDay
    ? showYear
      ? "EEE, MMM d, yyyy"
      : "EEE, MMM d"
    : showYear
      ? "EEE, MMM d, yyyy · h:mm a"
      : "EEE, MMM d · h:mm a";

  const startFormatted = format(start, formatString);
  if (event.allDay) return startFormatted;

  const endFormatted = format(end, "h:mm a");
  return `${startFormatted} - ${endFormatted}`;
}

export function formatDuration(start: Date, end: Date) {
  const totalMs = differenceInMilliseconds(end, start);

  if (totalMs < toMs("1m")) return "Less than a minute";

  let remainingMs = totalMs;

  const days = Math.floor(remainingMs / toMs("1d"));
  remainingMs %= toMs("1d");

  const hours = Math.floor(remainingMs / toMs("1h"));
  remainingMs %= toMs("1h");

  const minutes = Math.floor(remainingMs / toMs("1m"));

  const parts = [];
  if (days) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
  if (minutes) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

  return parts.join(" ");
}

export function calculateTimezoneDiffInTime(
  start: Date,
  userTimezone: string,
  normalizedEventTimezone: string,
  sameTimezone: boolean
) {
  if (!start || !userTimezone || !normalizedEventTimezone || sameTimezone) return "";

  const userZoned = fromZonedTime(start, userTimezone);
  const eventZoned = fromZonedTime(start, normalizedEventTimezone);

  const diff = differenceInMinutes(eventZoned, userZoned);

  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / 60);
  const minutes = absDiff % 60;

  const parts = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);

  const formattedDiff = parts.join(" ");
  const direction = diff < 0 ? "ahead of" : "behind";

  return `${formattedDiff} ${direction}`;
}

export function formatFilteredEventTime(event: Event): string {
  const start = new Date(`${event.startDate}T${event.startTime}`);
  const end = new Date(`${event.endDate}T${event.endTime}`);
  const sameDay = format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");

  if (event.allDay) {
    if (sameDay) {
      return format(start, "EEE d MMM yyyy");
    }

    const sameMonthYear = format(start, "MMM yyyy") === format(end, "MMM yyyy");

    if (sameMonthYear) {
      return `${format(start, "d")}–${format(end, "d MMM yyyy")}`;
    }

    return `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
  }

  if (sameDay) {
    const sameAmPm = format(start, "a") === format(end, "a");

    if (sameAmPm) {
      const startLabel = format(start, start.getMinutes() === 0 ? "h" : "h:mm");
      const endLabel = format(end, end.getMinutes() === 0 ? "h a" : "h:mm a");
      return `${startLabel} – ${endLabel}, ${format(start, "EEE d MMM yyyy")}`;
    }

    const startLabel = format(start, start.getMinutes() === 0 ? "h a" : "h:mm a");
    const endLabel = format(end, end.getMinutes() === 0 ? "h a" : "h:mm a");
    return `${startLabel} – ${endLabel}, ${format(start, "EEE d MMM yyyy")}`;
  }

  return `${format(start, start.getMinutes() === 0 ? "h a, EEE d MMM yyyy" : "h:mm a, EEE d MMM yyyy")} – ${format(
    end,
    end.getMinutes() === 0 ? "h a, EEE d MMM yyyy" : "h:mm a, EEE d MMM yyyy"
  )}`;
}
