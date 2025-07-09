import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { getValidTimeZone } from "$lib/shared/utils/timezone";
import type { Event, EventChunk } from "$lib/shared/types";

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
