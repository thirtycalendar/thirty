import { writable } from "svelte/store";

export const eventModalId = "event-modal-id";
export const eventCreateModalId = "event-create-modal-id";

export const isEventEditing = writable(false);

export function handleEventStopEditing() {
  isEventEditing.set(false);
}

export function handleEventStartEditing() {
  isEventEditing.set(false);
}

export function toggleEventEditMode() {
  isEventEditing.update((c) => !c);
}
