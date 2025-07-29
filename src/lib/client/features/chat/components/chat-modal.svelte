<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { chatModal } from "$lib/client/stores/modal";

  import { ChatDetails, EditChat } from ".";

  const { currentDetails, isEditing, stopEditing } = chatModal;
</script>

{#if $currentDetails}
  <Modal modalId={$currentDetails.id} title="Chat" onModalClose={stopEditing}>
    {#if $isEditing}
      <EditChat />
    {:else}
      <ChatDetails />
    {/if}
  </Modal>
{/if}
