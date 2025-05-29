import { toggleModal } from "$lib/components/utils";

export const taskModalId = "task-modal-id";

export function toggleTaskModal() {
  toggleModal(taskModalId);
}
