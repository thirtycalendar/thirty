import { format, parseISO } from "date-fns";

import type { Birthday } from "$lib/shared/types";

export function getBirthdaysForDay(birthdays: Birthday[], day: Date) {
  return birthdays.filter((bd) => format(parseISO(bd.dob), "MM-dd") === format(day, "MM-dd"));
}
