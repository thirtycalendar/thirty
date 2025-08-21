<script lang="ts">
  import type { Snippet } from "svelte";

  import { toggleModal } from "./utils";

  interface Props {
    id: string | number;
    children: Snippet;
    title?: string;
    onClose?: () => void;
  }

  let { id, children, title, onClose }: Props = $props();

  function hide() {
    toggleModal(id);
    onClose?.();
  }
</script>

<dialog id={String(id)} class="modal z-6000">
  <div class="modal-box border-base-200 max-h-[85vh] border">
    <!-- <div class="modal-action"> -->
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onclick={hide}>
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
