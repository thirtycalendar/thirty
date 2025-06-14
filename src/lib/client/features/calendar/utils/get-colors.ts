import { get } from "svelte/store";

import { calendarList } from "../queries/calendar-list";
import { colorList } from "../queries/color-list";

export function getCalendarColor(colorId: string): string {
  const colors = get(colorList);

  if (!colors || !colors.calendar[colorId]) return "transparent";

  return colors.calendar[colorId].background;
}

export function getEventColor(calendarId: string): string {
  const calendar = get(calendarList)?.find((cal) => cal.id === calendarId);
  const colorId = calendar?.colorId;
  const bg = get(colorList)?.calendar?.[colorId ?? ""]?.background;

  return bg ?? "transparent";
}

export function getEventBgColor(colorId: string): string {
  const colors = get(colorList);

  if (!colors || !colors.event[colorId]) return "transparent";

  return colors.event[colorId].background;
}
