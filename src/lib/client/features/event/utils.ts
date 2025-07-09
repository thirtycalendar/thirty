import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { getValidTimeZone } from "$lib/shared/utils/timezone";
import type { Event, EventChunk } from "$lib/shared/types";

export function getEventDateObjects(event: Event): { start: Date; end: Date } {
  const eventTimezone = getValidTimeZone(event.timezone);

  if (event.allDay) {
    const startUtc = fromZonedTime(`${event.startDate}T00:00:00`, eventTimezone);
    const endUtc = fromZonedTime(`${event.endDate}T23:59:59.999`, eventTimezone);
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

      // Sort overlapping group by duration (longer first), then start time
      overlappingGroup.sort((a, b) => {
        const durA = a.end.getTime() - a.start.getTime();
        const durB = b.end.getTime() - b.start.getTime();
        if (durB !== durA) return durB - durA;
        return a.start.getTime() - b.start.getTime();
      });

      // Assign offsets within this group
      const activeLanes: { end: Date; offset: number }[] = [];
      for (const chunk of overlappingGroup) {
        const remainingLanes = activeLanes.filter((lane) => lane.end > chunk.start);
        const usedOffsets = new Set(remainingLanes.map((lane) => lane.offset));
        let offset = 0;
        while (usedOffsets.has(offset)) offset++;
        offsets.set(chunk, offset);
        remainingLanes.push({ end: chunk.end, offset });
        activeLanes.splice(0, activeLanes.length, ...remainingLanes);
      }

      i = j; // Move to next non-overlapping group
    }
  }

  return offsets;
}
