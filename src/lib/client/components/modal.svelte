<script lang="ts">
  import type { Snippet } from "svelte";

  import { toggleModal } from "./utils";

  interface Props {
    modalId: string | number;
    children: Snippet;
    title?: string;
    onModalClose?: () => void;
  }

  let { modalId, children, title, onModalClose }: Props = $props();

  function handleModalClose() {
    toggleModal(modalId);
    onModalClose?.();
  }
</script>

<dialog id={String(modalId)} class="modal z-6000">
  <div class="modal-box border-base-200 max-h-[85vh] border">
    <!-- <div class="modal-action"> -->
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
        onclick={handleModalClose}
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
