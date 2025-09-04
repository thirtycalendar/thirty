<script lang="ts">
  import { DraggableModal } from "$lib/client/components";
  import { eventModalStore } from "$lib/client/stores/modal";

  import { Create, Details, Edit } from ".";

  const { modalId, activeItem, isEditing, stopEditing } = eventModalStore;
</script>

<DraggableModal id={modalId} title="Event"><Create /></DraggableModal>

{#if $activeItem}
  <DraggableModal id={$activeItem.id} title="Event" onClose={stopEditing}>
    {#if $isEditing}
      <Edit event={$activeItem} />
    {:else}
      <Details event={$activeItem} />
    {/if}
  </DraggableModal>
{/if}
