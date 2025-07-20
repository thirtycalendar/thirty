<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { calendarModal } from "$lib/client/stores/modal";

  import { CalDetails, CreateCal, EditCal } from ".";

  const { modalId, currentDetails, isEditing, stopEditing } = calendarModal;
</script>

<Modal {modalId} title="Calendar"><CreateCal /></Modal>

{#if $currentDetails}
  <Modal modalId={$currentDetails.id} title="Calendar" onModalClose={stopEditing}>
    {#if $isEditing}
      <EditCal calendar={$currentDetails} />
    {:else}
      <CalDetails calendar={$currentDetails} />
    {/if}
  </Modal>
{/if}
