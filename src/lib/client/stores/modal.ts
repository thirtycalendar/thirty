import { tick } from "svelte";
import { get, writable, type Writable } from "svelte/store";

import { toggleModal } from "../components/utils";

export function createModalStore<T extends { id: string }>(modalIdPrefix: string) {
  const currentDetails: Writable<T | null> = writable(null);
  const isEditing = writable(false);

  const modalId = `${modalIdPrefix}-modal-id`;
  const createModalId = `${modalIdPrefix}-create-modal-id`;

  async function handleModal(item: T) {
    const current = get(currentDetails);

    if (current?.id === item.id) {
      currentDetails.set(null);
      await tick();
    }

    currentDetails.set(item);
    await tick();
    toggleModal(item.id);
  }

  function startEditing() {
    isEditing.set(true);
  }

  function stopEditing() {
    isEditing.set(false);
  }

  function toggleEditMode() {
    isEditing.update((c) => !c);
  }

  return {
    currentDetails,
    isEditing,
    modalId,
    createModalId,
    handleModal,
    startEditing,
    stopEditing,
    toggleEditMode
  };
}
