import { toggleModal } from "$lib/client/components/utils";

export const taskModalId = "task-modal-id";

export function toggleTaskModal() {
  toggleModal(taskModalId);
}
