export function toggleSidebar(id: string) {
  const isOpen = localStorage.getItem(id) === "true";

  localStorage.setItem(id, String(!isOpen));
}
