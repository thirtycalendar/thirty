import { toZonedTime } from "date-fns-tz";

import type { Event } from "$lib/shared/types";

export function getEventDateTime(event: Event, type: "start" | "end"): Date {
  const date = event[`${type}Date`] as string;
  const time = event[`${type}Time`] as string;
  const tz = event.timezone;
  const isoString = `${date}T${time}`;
  return toZonedTime(new Date(isoString), tz);
}
