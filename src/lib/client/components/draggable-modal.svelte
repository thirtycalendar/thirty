<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  import { DragDropHorizontalIcon } from "@hugeicons/core-free-icons";

  import { draggable, type DragPos } from "../actions/draggable";
  import { Icon } from "./icons";
  import { toggleDraggableModal } from "./utils";

  interface Props {
    id: string | number;
    title?: string;
    position?: DragPos;
    children: Snippet;
    onClose?: () => void;
  }

  let { id, title, position, children, onClose }: Props = $props();

  let boxEl: HTMLDivElement | undefined = $state();
  let headerEl: HTMLDivElement | undefined = $state();

  const defaultPosition: DragPos = {
    x: browser ? innerWidth / 2 : 0,
    y: browser ? innerHeight / 2 : 0
  };

  export function hide() {
    toggleDraggableModal(id);
    onClose?.();

    position = defaultPosition;
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
    position = defaultPosition;

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
</script>

<div
  id={String(id)}
  class="fixed inset-0 z-[6000] hidden"
  role="presentation"
  onclick={onBackdropClick}
>
  <div
    bind:this={boxEl}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="border-radius border-base-300 bg-base-200 fixed z-[101] max-h-full w-[91%] max-w-lg overflow-y-auto border p-1 shadow-md"
    use:draggable={{
      handle: headerEl,
      boundary: "window",
      position,
      onDrag: (p) => (position = p)
    }}
    style="
      left: {position?.x ?? 0}px;
      top: {position?.y ?? 0}px;
      transform: translate(-50%, -50%);
    "
  >
    <div bind:this={headerEl} class="flex !cursor-all-scroll items-center justify-center py-1">
      <Icon icon={DragDropHorizontalIcon} absoluteStrokeWidth />
    </div>

    <button class="btn btn-sm btn-circle btn-ghost absolute top-10 right-2" onclick={hide}>
      ✕
    </button>

    <div class="border-radius border-base-200 bg-base-100 max-h-[85vh] rounded border p-[24px]">
      {#if title}
        <h3 class="mb-1 font-semibold">{title}</h3>
      {/if}
      <div class="overflow-y-auto">
        {@render children()}
      </div>
    </div>
  </div>
</div>
