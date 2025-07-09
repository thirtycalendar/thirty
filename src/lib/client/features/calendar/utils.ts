import { get } from "svelte/store";

import { isWithinInterval } from "date-fns";

import { checkedCalendars } from "$lib/client/stores/checked-calendars";

import type { Event } from "$lib/shared/types";

import { getEventDateObjects } from "../event/utils";

export function getVisibleEvents(events: Event[], start: Date, end: Date) {
  const all: Event[] = [];
  const timed: Event[] = [];

  for (const event of events) {
    const calendars = get(checkedCalendars);
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
