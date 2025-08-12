export function toggleModal(modalId: string | number) {
  document.getElementById(String(modalId))?.classList.toggle("modal-open");
}
