<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  import { draggable, type DragPos } from "../actions/draggable";
  import { cn } from "../utils/cn";
  import { hideDraggableModal } from "./utils";

  interface Props {
    id: string | number;
    title?: string;
    class?: string;
    position?: DragPos;
    children: Snippet;
    onClose?: () => void;
  }

  let { id, title, class: classCn, position, children, onClose }: Props = $props();

  let boxEl: HTMLDivElement | undefined = $state();
  let headerEl: HTMLDivElement | undefined = $state();

  const defaultPosition: DragPos = {
    x: browser ? innerWidth / 2 : 0,
    y: browser ? innerHeight / 2 : 0
  };

  export function hide() {
    hideDraggableModal(id);
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
  class={cn("fixed inset-0 z-[9997] hidden", classCn)}
  role="presentation"
  onclick={onBackdropClick}
>
  <div
    bind:this={boxEl}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="border-rounded base-border bg-base-200 fixed z-[101] max-h-full p-1 shadow-md"
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
      width: min(450px, 90vw);
      max-width: 100%;
    "
  >
    <button
      class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 opacity-65 hover:opacity-100"
      onclick={hide}
    >
      ✕
    </button>

    <div
      class="border-rounded border-base-200 bg-base-100 max-h-[85vh] overflow-y-auto rounded border p-5 pt-0"
    >
      <div
        bind:this={headerEl}
        class="flex !cursor-all-scroll items-center justify-center pb-5"
      ></div>

      {#if title}
        <h3 class="text-primary-content/80 mb-1 font-semibold">{title}</h3>
      {/if}
      <div class="overflow-y-auto">
        {@render children()}
      </div>
    </div>
  </div>
</div>
