import { format, parseISO } from "date-fns";

import type { Birthday } from "$lib/shared/types";

export function getBirthdaysForDay(birthdays: Birthday[] | null, day: Date) {
  if (!birthdays) return [];

  return birthdays.filter((bd) => format(parseISO(bd.dob), "MM-dd") === format(day, "MM-dd"));
}

export function getVisibleBirthdays(birthdays: Birthday[] | null, unchecked: string[]) {
  if (!birthdays) return [];

  return birthdays.filter((bd) => !unchecked.includes(bd.id));
}
