import { tick } from "svelte";
import { get, writable } from "svelte/store";

import type { Calendar } from "$lib/shared/types";

import { toggleModal } from "../components/utils";

export const currentCalendarDetails = writable<Calendar | null>();

export async function handleCalModal(cal: Calendar) {
  const current = get(currentCalendarDetails);

  if (current?.id === cal.id) {
    currentCalendarDetails.set(null);
    await tick();
  }

  currentCalendarDetails.set(cal);
  await tick();
  toggleModal(cal.id);
}

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
