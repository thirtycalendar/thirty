<script lang="ts">
  import DraggableModal from "$lib/client/components/draggable-modal.svelte";
  import { toggleDraggableModal } from "$lib/client/components/utils";

  let modalRef: DraggableModal | null = null;

  function openCreateAtCursor(e: MouseEvent) {
    modalRef?.setPosition({ x: e.clientX, y: e.clientY });
    toggleDraggableModal("draggable-modal-id");
  }
</script>

<button class="btn btn-primary" onclick={openCreateAtCursor}>New Event</button>

<DraggableModal id="draggable-modal-id" bind:this={modalRef} title="New Event">
  Hello
</DraggableModal>
