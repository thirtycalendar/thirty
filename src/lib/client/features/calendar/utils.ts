import { get } from "svelte/store";

import { getCalendars } from "./query";

export function getColorIdFromCalendarId(id: string): string {
  const { data } = getCalendars();
  const calendars = get(data);

  return calendars?.find((cal) => cal.id === id)?.colorId ?? "-1";
}

export function getNameFromCalendarId(id: string): string {
  const { data } = getCalendars();
  const calendars = get(data);

  return calendars?.find((cal) => cal.id === id)?.name ?? "Unknown calendar";
}
