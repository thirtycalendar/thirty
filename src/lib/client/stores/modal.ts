import { tick } from "svelte";
import { get, writable } from "svelte/store";

import type { Birthday, Calendar, Chat, Event, Holiday, HolidayCountry } from "$lib/shared/types";

import { toggleDraggableModal, toggleModal } from "../components/utils";

export const calendarModalStore = createModalStore<Calendar>("calendar", toggleDraggableModal);
export const eventModalStore = createModalStore<Event>("event", toggleDraggableModal);
export const birthdayModalStore = createModalStore<Birthday>("birthday", toggleDraggableModal);
export const holidayModalStore = createModalStore<Holiday>("holiday", toggleDraggableModal);
export const holidayCountryModalStore = createModalStore<HolidayCountry>(
  "holiday-country",
  toggleDraggableModal
);

// Chat
export const chatModalStore = createModalStore<Chat>("chat", toggleDraggableModal);
export const chatDetailsModalStore = createModalStore<Chat>("chat-details", toggleModal);
export const chatHistoryModalStore = createModalStore("chat-history", toggleModal);

// Settings
export const settingsModalStore = createModalStore("settings", toggleModal);

export function createModalStore<T extends { id: string }>(
  prefix: string,
  toggleFn: (modalId: string | number) => void
) {
  const modalId = `${prefix}-modal-id`;
  const createModalId = `${prefix}-modal-id`;

  const activeItem = writable<T | null>(null);
  const isEditing = writable(false);

  async function openModal(item: T) {
    // Close if same item is already open
    if (get(activeItem)?.id === item.id) {
      activeItem.set(null);
      await tick();
    }

    activeItem.set(item);
    await tick();

    toggleFn(item.id);
  }

  function toggleModal() {
    toggleFn(modalId);
  }

  return {
    prefix,
    activeItem,
    isEditing,
    modalId,
    createModalId,
    openModal,
    toggleModal,
    startEditing: () => isEditing.set(true),
    stopEditing: () => isEditing.set(false),
    toggleEditing: () => isEditing.update((v) => !v)
  };
}
