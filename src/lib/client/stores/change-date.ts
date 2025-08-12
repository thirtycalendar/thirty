import { writable } from "svelte/store";

import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from "date-fns";

export const currentDate = writable(new Date());

export const goToToday = () => currentDate.set(new Date());

// Year
export const goToNextYear = () => currentDate.update((d) => addYears(d, 1));
export const goToPreviousYear = () => currentDate.update((d) => subYears(d, 1));

// Month
export const goToNextMonth = () => currentDate.update((d) => addMonths(d, 1));
export const goToPreviousMonth = () => currentDate.update((d) => subMonths(d, 1));

// Week
export const goToNextWeek = () => currentDate.update((d) => addWeeks(d, 1));
export const goToPreviousWeek = () => currentDate.update((d) => subWeeks(d, 1));

// Day
export const goToNextDay = () => currentDate.update((d) => addDays(d, 1));
export const goToPreviousDay = () => currentDate.update((d) => subDays(d, 1));
