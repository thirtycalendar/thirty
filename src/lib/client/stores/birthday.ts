import { tick } from "svelte";
import { get, writable } from "svelte/store";

import type { Birthday } from "$lib/shared/types";

import { toggleModal } from "../components/utils";

export const currentBirthdayDetails = writable<Birthday | null>();

export async function handleBirthdayModal(cal: Birthday) {
  const current = get(currentBirthdayDetails);

  if (current?.id === cal.id) {
    currentBirthdayDetails.set(null);
    await tick();
  }

  currentBirthdayDetails.set(cal);
  await tick();
  toggleModal(cal.id);
}

export const birthdayModalId = "birthday-modal-id";
export const birthdayCreateModalId = "birthday-create-modal-id";

export const isBirthdayEditing = writable(false);

export function handleBirthdayStopEditing() {
  isBirthdayEditing.set(false);
}

export function handleBirthdayStartEditing() {
  isBirthdayEditing.set(true);
}

export function toggleBirthdayEditMode() {
  isBirthdayEditing.update((c) => !c);
}
