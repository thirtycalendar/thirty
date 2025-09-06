export function portal(node: HTMLElement, target: HTMLElement | string = "body") {
  const targetEl: HTMLElement | null =
    typeof target === "string" ? document.querySelector(target) : target;

  if (targetEl) {
    targetEl.appendChild(node);
  }

  return {
    destroy() {
      if (targetEl?.contains(node)) {
        targetEl.removeChild(node);
      }
    }
  };
}
