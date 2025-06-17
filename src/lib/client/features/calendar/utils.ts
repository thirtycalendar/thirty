import { get } from "svelte/store";

import { getCalList } from "./query";

export function getColorIdFromCalendarId(id: string): string {
  const { calendarList } = getCalList();
  const calendars = get(calendarList);

  return calendars?.find((cal) => cal.id === id)?.colorId ?? "-1";
}
