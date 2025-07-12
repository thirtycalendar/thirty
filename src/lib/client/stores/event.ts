import type { Event } from "$lib/shared/types";

import { createModalStore } from "./modal";

export const {
  currentDetails: currentEventDetails,
  isEditing: isEventEditing,
  modalId: eventModalId,
  createModalId: eventCreateModalId,
  handleModal: handleEventModal,
  startEditing: handleEventStartEditing,
  stopEditing: handleEventStopEditing,
  toggleEditMode: toggleEventEditMode
} = createModalStore<Event>("event");
