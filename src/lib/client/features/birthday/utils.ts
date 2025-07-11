import { format, parseISO } from "date-fns";

import type { Birthday } from "$lib/shared/types";

export function getBirthdaysForDay(birthdays: Birthday[], day: Date) {
  return birthdays.filter((bd) => format(parseISO(bd.dob), "MM-dd") === format(day, "MM-dd"));
}

export function getVisibleBirthdays(birthdays: Birthday[], unchecked: string[]) {
  const visibleBirthdays: Birthday[] = [];

  for (const birthday of birthdays) {
    const isNotVisible = unchecked.includes(birthday.id);
    if (isNotVisible) continue;

    visibleBirthdays.push(birthday);
  }

  return visibleBirthdays;
}
