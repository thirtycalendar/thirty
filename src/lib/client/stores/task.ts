import { toggleModal } from "$lib/client/components/utils";

export const taskCreateModalId = "task-modal-id";

export function toggleTaskCreateModal() {
  toggleModal(taskCreateModalId);
}
