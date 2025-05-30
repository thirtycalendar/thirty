import { toggleModal } from "$lib/client/components/utils";

export const eventModalId = "event-modal-id";

export function toggleEventModal() {
  toggleModal(eventModalId);
}
