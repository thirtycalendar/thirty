import { toggleModal } from "$lib/ui/components/utils";

export const taskModalId = "task-modal-id";

export function toggleTaskModal() {
  toggleModal(taskModalId);
}
