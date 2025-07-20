<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { eventModal } from "$lib/client/stores/modal";

  import { CreateEvent, EditEvent, EventDetails } from ".";

  const { modalId, currentDetails, isEditing, stopEditing } = eventModal;
</script>

<Modal {modalId} title="Event"><CreateEvent /></Modal>

{#if $currentDetails}
  <Modal modalId={$currentDetails.id} title="Event" onModalClose={stopEditing}>
    {#if $isEditing}
      <EditEvent event={$currentDetails} />
    {:else}
      <EventDetails event={$currentDetails} />
    {/if}
  </Modal>
{/if}
