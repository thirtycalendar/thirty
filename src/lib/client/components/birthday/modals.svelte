<script lang="ts">
  import { DraggableModal } from "$lib/client/components";
  import { birthdayModalStore } from "$lib/client/stores/modal";

  import { Create, Details, Edit } from ".";

  const { modalId, activeItem, isEditing, stopEditing } = birthdayModalStore;
</script>

<DraggableModal id={modalId} title="Birthday"><Create /></DraggableModal>

{#if $activeItem}
  <DraggableModal id={$activeItem.id} title="Birthday" onClose={stopEditing}>
    {#if $isEditing}
      <Edit birthday={$activeItem} />
    {:else}
      <Details birthday={$activeItem} />
    {/if}
  </DraggableModal>
{/if}
