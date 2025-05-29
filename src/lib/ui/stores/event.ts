import { toggleModal } from "$lib/components/utils";

export const eventModalId = "event-modal-id";

export function toggleEventModal() {
  toggleModal(eventModalId);
}
