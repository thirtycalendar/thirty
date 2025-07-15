import { format } from "date-fns";

import type { Holiday } from "$lib/shared/types";

export function getHolidaysForDay(holidays: Holiday[] | null, day: Date): Holiday[] {
  if (!holidays) {
    return [];
  }
  const dayString = format(day, "yyyy-MM-dd");
  return holidays.filter((holiday) => holiday.date === dayString);
}
