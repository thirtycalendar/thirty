<script lang="ts">
  import { DraggableModal } from "$lib/client/components";
  import { calendarModalStore } from "$lib/client/stores/modal";

  import { Create, Details, Edit } from ".";

  const { modalId, activeItem, isEditing, stopEditing } = calendarModalStore;
</script>

<DraggableModal id={modalId} title="Calendar"><Create /></DraggableModal>

{#if $activeItem}
  <DraggableModal id={$activeItem.id} title="Calendar" onClose={stopEditing}>
    {#if $isEditing}
      <Edit calendar={$activeItem} />
    {:else}
      <Details calendar={$activeItem} />
    {/if}
  </DraggableModal>
{/if}
