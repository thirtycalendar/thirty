import { differenceInDays, isWithinInterval, max, min, startOfDay } from "date-fns";

import type { AllDayLayoutInfo, Event } from "$lib/shared/types";

import { getEventDateObjects } from "../event/utils";

export function getVisibleEvents(
  events: Event[],
  start: Date,
  end: Date,
  calendars: Record<string, boolean>
) {
  const all: Event[] = [];
  const timed: Event[] = [];

  for (const event of events) {
    const isVisible = calendars[event.calendarId] !== false;
    if (!isVisible) continue;

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

export function calculateAllDayLayout(
  allDayEvents: Event[],
  weekStart: Date,
  weekEnd: Date
): AllDayLayoutInfo[] {
  const sortedEvents = [...allDayEvents].sort((a, b) => {
    const startA = getEventDateObjects(a).start;
    const startB = getEventDateObjects(b).start;
    return startA.getTime() - startB.getTime();
  });

  const lanes: (string | null)[][] = [];
  const layout: AllDayLayoutInfo[] = [];

  for (const event of sortedEvents) {
    const { start, end } = getEventDateObjects(event);
    const eventStart = max([startOfDay(start), weekStart]);
    const eventEnd = min([startOfDay(end), weekEnd]);
    const startColumn = differenceInDays(eventStart, weekStart);
    const endColumn = differenceInDays(eventEnd, weekStart);

    let targetLane = 0;
    while (true) {
      if (!lanes[targetLane]) lanes[targetLane] = new Array(7).fill(null);
      const isOccupied = lanes[targetLane].slice(startColumn, endColumn + 1).some((c) => c);
      if (!isOccupied) break;
      targetLane++;
    }

    for (let i = startColumn; i <= endColumn; i++) lanes[targetLane][i] = event.id;

    layout.push({
      ...event,
      startColumn: startColumn + 1,
      span: endColumn - startColumn + 1,
      lane: targetLane
    });
  }

  return layout;
}
