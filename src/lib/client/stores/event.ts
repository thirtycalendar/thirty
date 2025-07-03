import { tick } from "svelte";
import { get, writable } from "svelte/store";

import type { Event } from "$lib/types";

import { toggleModal } from "../components/utils";

export const currentEventDetails = writable<Event | null>();

export async function handleEventModal(event: Event) {
  const current = get(currentEventDetails);

  if (current?.id === event.id) {
    currentEventDetails.set(null);
    await tick();
  }

  currentEventDetails.set(event);
  await tick();
  toggleModal(event.id);
}

export const eventModalId = "event-modal-id";
export const eventCreateModalId = "event-create-modal-id";

export const isEventEditing = writable(false);

export function handleEventStopEditing() {
  isEventEditing.set(false);
}

export function handleEventStartEditing() {
  isEventEditing.set(true);
}

export function toggleEventEditMode() {
  isEventEditing.update((c) => !c);
}
