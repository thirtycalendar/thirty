export type DragPos = { x: number; y: number };

type Opts = {
  handle?: HTMLElement | null;
  boundary?: "window" | HTMLElement;
  position?: DragPos; // initial position (px)
  onDrag?: (pos: DragPos) => void;
};

export function draggable(node: HTMLElement, opts: Opts = {}) {
  let handle = opts.handle ?? node;
  let boundary = opts.boundary ?? "window";
  let pos: DragPos = { x: opts.position?.x ?? 80, y: opts.position?.y ?? 80 };
  let dragging = false;
  let start = { x: 0, y: 0 };

  // apply initial transform
  setTransform(pos);

  function getBounds() {
    if (boundary === "window") {
      return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    }
    const r = (boundary as HTMLElement).getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  }

  function clamp(next: DragPos) {
    const rect = node.getBoundingClientRect();
    const b = getBounds();
    const margin = 8; // keep a bit visible
    const maxX = b.right - rect.width - margin;
    const maxY = b.bottom - rect.height - margin;
    const minX = b.left + margin;
    const minY = b.top + margin;
    return {
      x: Math.min(Math.max(next.x, minX), maxX),
      y: Math.min(Math.max(next.y, minY), maxY)
    };
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    dragging = true;
    handle!.setPointerCapture(e.pointerId);
    start = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    node.style.willChange = "transform";
    (handle as HTMLElement).style.cursor = "grabbing";
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const next = clamp({ x: e.clientX - start.x, y: e.clientY - start.y });
    pos = next;
    setTransform(pos);
    opts.onDrag?.(pos);
  }

  function onPointerUp(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    try {
      handle!.releasePointerCapture(e.pointerId);
      // eslint-disable-next-line no-empty
    } catch {}
    node.style.willChange = "";
    (handle as HTMLElement).style.cursor = "grab";
  }

  function setTransform(p: DragPos) {
    node.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
  }

  handle?.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  (handle as HTMLElement).style.cursor = "grab";

  return {
    update(next: Opts) {
      handle?.removeEventListener("pointerdown", onPointerDown);
      handle = next.handle ?? node;
      boundary = next.boundary ?? "window";
      if (next.position) {
        pos = next.position;
        setTransform(pos);
      }
      opts = next;
      handle?.addEventListener("pointerdown", onPointerDown);
    },
    destroy() {
      handle?.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
  };
}
