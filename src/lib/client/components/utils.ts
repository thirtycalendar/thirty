export function toggleModal(modalId: string | number) {
  document.getElementById(String(modalId))?.classList.toggle("modal-open");
}

export function hideToggleModal(modalId: string | number) {
  document.getElementById(String(modalId))?.classList.toggle("modal-open");
}

export function toggleDraggableModal(modalId: string | number) {
  document.getElementById(String(modalId))?.classList.toggle("draggable-modal-open");
}

export function hideDraggableModal(modalId: string | number) {
  document.getElementById(String(modalId))?.classList.remove("draggable-modal-open");
}
