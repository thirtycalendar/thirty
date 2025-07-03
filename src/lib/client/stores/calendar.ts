import { writable } from "svelte/store";

import type { Calendar } from "$lib/types";

export const currentCalendarDetails = writable<Calendar | null>();

export const calendarModalId = "calendar-modal-id";
export const calendarCreateModalId = "calendar-create-modal-id";

export const isCalendarEditing = writable(false);

export function handleCalendarStopEditing() {
  isCalendarEditing.set(false);
}

export function handleCalendarStartEditing() {
  isCalendarEditing.set(true);
}

export function toggleCalendarEditMode() {
  isCalendarEditing.update((c) => !c);
}
