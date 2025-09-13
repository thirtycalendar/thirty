<script lang="ts">
  import { chatDetailsModalStore } from "$lib/client/stores/modal";

  import { Modal } from "..";
  import { Details, Edit } from ".";

  const { activeItem, isEditing, stopEditing } = chatDetailsModalStore;
</script>

{#if $activeItem}
  <Modal id={$activeItem.id} title="Chat" class="z-[9999]" onClose={stopEditing}>
    {#if $isEditing}
      <Edit chat={$activeItem} />
    {:else}
      <Details chat={$activeItem} />
    {/if}
  </Modal>
{/if}
