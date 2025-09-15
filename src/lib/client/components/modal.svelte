<script lang="ts">
  import type { Snippet } from "svelte";

  import { cn } from "../utils/cn";
  import { hideToggleModal } from "./utils";

  interface Props {
    id: string | number;
    children: Snippet;
    title?: string;
    class?: string;
    modelBoxClass?: string;
    onClose?: () => void;
  }

  let { id, children, title, class: classCn, modelBoxClass, onClose }: Props = $props();

  function hide() {
    hideToggleModal(id);
    onClose?.();
  }
</script>

<dialog id={String(id)} class={cn("modal z-9997", classCn)}>
  <div class={cn("modal-box base-border max-h-[85vh]", modelBoxClass)}>
    <!-- <div class="modal-action"> -->
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 opacity-65 hover:opacity-100"
        onclick={hide}
      >
        ✕
      </button>
    </form>
    <!-- </div> -->

    {#if title}
      <p class="mb-1 font-semibold">{title}</p>
    {/if}

    <div class="overflow-y-scroll">
      {@render children()}
    </div>
  </div>
</dialog>
