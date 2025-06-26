import { writable } from "svelte/store";

import { toggleModal } from "$lib/client/components/utils";

export const eventModalId = "event-modal-id";

export function toggleEventModal() {
  toggleModal(eventModalId);
}

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

export const eventCreateModalId = "event-create-modal-id";

export function toggleEventCreateModal() {
  toggleModal(eventCreateModalId);
}
