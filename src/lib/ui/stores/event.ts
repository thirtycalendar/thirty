import { toggleModal } from "$lib/ui/components/utils";

export const eventModalId = "event-modal-id";

export function toggleEventModal() {
  toggleModal(eventModalId);
}
