import { tick } from "svelte";
import { get, writable } from "svelte/store";

import type { Birthday, Calendar, Event, Holiday, HolidayCountry } from "$lib/shared/types";

import { toggleModal } from "../components/utils";

export const calendarModal = createModalStore<Calendar>("calendar");
export const eventModal = createModalStore<Event>("event");
export const birthdayModal = createModalStore<Birthday>("birthday");
export const holidayModal = createModalStore<Holiday>("holiday");
export const holidayCountryModal = createModalStore<HolidayCountry>("holiday-country");

export function createModalStore<T extends { id: string }>(prefix: string) {
  const currentDetails = writable<T | null>(null);
  const isEditing = writable(false);

  async function handleModal(item: T) {
    if (get(currentDetails)?.id === item.id) {
      currentDetails.set(null);
      await tick();
    }
    currentDetails.set(item);
    await tick();
    toggleModal(item.id);
  }

  return {
    prefix,
    currentDetails,
    isEditing,
    modalId: `${prefix}-modal-id`,
    createModalId: `${prefix}-create-modal-id`,
    handleModal,
    startEditing: () => isEditing.set(true),
    stopEditing: () => isEditing.set(false),
    toggleEditMode: () => isEditing.update((c) => !c)
  };
}
