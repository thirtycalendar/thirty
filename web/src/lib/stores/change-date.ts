import { writable } from "svelte/store";
import { addDays, addWeeks, subDays, subWeeks } from "date-fns";

export const currentDate = writable(new Date());

export const goToToday = () => currentDate.set(new Date());

// Week
export const goToNextWeek = () => currentDate.update((d) => addWeeks(d, 1));
export const goToPreviousWeek = () => currentDate.update((d) => subWeeks(d, 1));

// Day
export const goToNextDay = () => currentDate.update((d) => addDays(d, 1));
export const goToPreviousDay = () => currentDate.update((d) => subDays(d, 1));
