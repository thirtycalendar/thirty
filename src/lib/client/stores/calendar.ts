import type { Calendar } from "$lib/shared/types";

import { createModalStore } from "./modal";

export const {
  currentDetails: currentCalendarDetails,
  isEditing: isCalendarEditing,
  modalId: calendarModalId,
  createModalId: calendarCreateModalId,
  handleModal: handleCalModal,
  startEditing: handleCalendarStartEditing,
  stopEditing: handleCalendarStopEditing,
  toggleEditMode: toggleCalendarEditMode
} = createModalStore<Calendar>("calendar");
