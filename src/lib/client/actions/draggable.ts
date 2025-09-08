export type DragPos = { x: number; y: number };

type Opts = {
  handle?: HTMLElement | null;
  boundary?: "window" | HTMLElement;
  position?: DragPos;
  onDrag?: (pos: DragPos) => void;
  margin?: number;
};

export function draggable(node: HTMLElement, opts: Opts = {}) {
  let handle = opts.handle ?? node;
  let boundary = opts.boundary ?? "window";
  let pos: DragPos = { x: opts.position?.x ?? 80, y: opts.position?.y ?? 80 };
  let dragging = false;
  let start = { dx: 0, dy: 0 };
  let margin = opts.margin ?? 8;

  (handle as HTMLElement).style.cursor = "grab";
  (handle as HTMLElement).style.touchAction = "none";

  setLeftTop(pos);

  function bRect() {
    if (boundary === "window") {
      return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    }
    const r = (boundary as HTMLElement).getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  }

  function clampCenter(next: DragPos) {
    const halfW = node.offsetWidth / 2;
    const halfH = node.offsetHeight / 2;
    const b = bRect();

    const minX = b.left + halfW + margin;
    const maxX = b.right - halfW - margin;
    const minY = b.top + halfH + margin;
    const maxY = b.bottom - halfH - margin;

    return {
      x: Math.min(Math.max(next.x, minX), Math.max(minX, maxX)),
      y: Math.min(Math.max(next.y, minY), Math.max(minY, maxY))
    };
  }

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select, [role='button']")) {
      return;
    }

    dragging = true;
    try {
      handle!.setPointerCapture(e.pointerId);
      // eslint-disable-next-line no-empty
    } catch {}
    start = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    node.style.willChange = "left, top";
    (handle as HTMLElement).style.cursor = "grabbing";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node.style as any).userSelect = "none";
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const next = clampCenter({ x: e.clientX - start.dx, y: e.clientY - start.dy });
    pos = next;
    setLeftTop(pos);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node.style as any).userSelect = "";
  }

  function setLeftTop(p: DragPos) {
    node.style.left = `${p.x}px`;
    node.style.top = `${p.y}px`;
  }

  handle?.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  return {
    update(next: Opts) {
      margin = next.margin ?? margin;
      if (handle !== (next.handle ?? node)) {
        handle?.removeEventListener("pointerdown", onPointerDown);
        handle = next.handle ?? node;
        handle?.addEventListener("pointerdown", onPointerDown);
        (handle as HTMLElement).style.cursor = "grab";
        (handle as HTMLElement).style.touchAction = "none";
      }
      boundary = next.boundary ?? boundary;
      if (next.position) {
        pos = next.position;
        setLeftTop(pos);
      }
      opts = next;
    },
    destroy() {
      handle?.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }
  };
}
