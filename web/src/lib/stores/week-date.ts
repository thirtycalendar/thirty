import { writable } from "svelte/store";
import { addWeeks, subWeeks } from "date-fns";

export const currentDate = writable(new Date());

export const goToToday = () => currentDate.set(new Date());
export const goToNextWeek = () => currentDate.update((d) => addWeeks(d, 1));
export const goToPreviousWeek = () => currentDate.update((d) => subWeeks(d, 1));
