import type { Birthday } from "$lib/shared/types";

import { createModalStore } from "./modal";

export const {
  currentDetails: currentBirthdayDetails,
  isEditing: isBirthdayEditing,
  modalId: birthdayModalId,
  createModalId: birthdayCreateModalId,
  handleModal: handleBirthdayModal,
  startEditing: handleBirthdayStartEditing,
  stopEditing: handleBirthdayStopEditing,
  toggleEditMode: toggleBirthdayEditMode
} = createModalStore<Birthday>("birthday");
