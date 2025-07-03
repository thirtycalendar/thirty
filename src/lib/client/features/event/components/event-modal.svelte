<script lang="ts">
  import { Modal } from "$lib/client/components";
  import {
    currentEventDetails,
    eventCreateModalId,
    handleEventStopEditing,
    isEventEditing
  } from "$lib/client/stores/event";

  import { CreateEvent, EditEvent, EventDetails } from ".";

  function onDetailsModalClose() {
    handleEventStopEditing();
  }
</script>

<Modal modalId={eventCreateModalId} title="Event"><CreateEvent /></Modal>

{#if $currentEventDetails}
  <Modal modalId={$currentEventDetails.id} title="Event" onModalClose={onDetailsModalClose}>
    {#if $isEventEditing}
      <EditEvent event={$currentEventDetails} />
    {:else}
      <EventDetails event={$currentEventDetails} />
    {/if}
  </Modal>
{/if}
