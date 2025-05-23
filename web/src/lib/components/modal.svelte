<script lang="ts">
  import type { Snippet } from "svelte";

  import { toggleModal } from "./utils";

  interface ModalProps {
    modalId: string | number;
    children: Snippet;
    title?: string;
    onModalClose?: () => void;
  }

  let { modalId, children, title, onModalClose }: ModalProps = $props();

  function handleModalClose() {
    toggleModal(modalId);
    onModalClose?.();
  }
</script>

<dialog id={String(modalId)} class="modal z-6000">
  <div class="modal-box max-h-[85vh]">
    <!-- <div class="modal-action"> -->
    <form method="dialog">
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onclick={handleModalClose}
      >
        ✕
      </button>
    </form>
    <!-- </div> -->

    {#if title}
      <h3 class="font-bold text-lg mb-1">{title}</h3>
    {/if}

    <div class="overflow-y-scroll">
      {@render children()}
    </div>
  </div>
</dialog>
