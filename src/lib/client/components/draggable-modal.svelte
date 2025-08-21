<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";

  import { draggable, type DragPos } from "../actions/draggable";
  import { toggleDraggableModal } from "./utils";

  interface Props {
    id: string | number;
    title?: string;
    position?: DragPos;
    children: Snippet;
    onClose?: () => void;
  }

  let { id, title, position = { x: 80, y: 80 }, children, onClose }: Props = $props();

  let boxEl: HTMLDivElement | undefined = $state();
  let headerEl: HTMLDivElement | undefined = $state();

  export function hide() {
    console.log(id, "hide...");
    toggleDraggableModal(id);
    onClose?.();
  }

  export function setPosition(p: DragPos) {
    position = p;
  }

  function onBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) hide();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === "Escape") hide();
  }

  onMount(() => {
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
</script>

<div
  id={String(id)}
  class="fixed inset-0 z-[100] hidden"
  role="presentation"
  onclick={onBackdropClick}
>
  <div
    bind:this={boxEl}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="rounded-box bg-base-100 outline-base-300 fixed z-[101] w-[92vw] max-w-md overflow-hidden shadow-2xl outline-1 sm:w-[520px]"
    use:draggable={{
      handle: headerEl,
      boundary: "window",
      position,
      onDrag: (p) => (position = p)
    }}
    style="transform: translate3d({position.x}px, {position.y}px, 0)"
  >
    <div bind:this={headerEl} class="bg-red-100 p-2"></div>

    <div class="border-base-300 flex items-center gap-2 border-b p-3 select-none">
      {#if title}
        <h3 class="text-base font-semibold">{title}</h3>
      {/if}
      <button class="btn btn-ghost btn-xs ml-auto" onclick={hide} tabindex="0">✕</button>
    </div>

    <div class="max-h-[80vh] overflow-y-auto p-4">
      {@render children()}
    </div>
  </div>
</div>
