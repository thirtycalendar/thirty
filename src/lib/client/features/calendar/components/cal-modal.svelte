<script lang="ts">
  import { Modal } from "$lib/client/components";
  import {
    calendarCreateModalId,
    currentCalendarDetails,
    handleCalendarStopEditing,
    isCalendarEditing
  } from "$lib/client/stores/calendar";

  import { CalDetails, CreateCal, EditCal } from ".";

  function onDetailsModalClose() {
    handleCalendarStopEditing();
  }
</script>

<Modal modalId={calendarCreateModalId} title="Calendar"><CreateCal /></Modal>

{#if $currentCalendarDetails}
  <Modal modalId={$currentCalendarDetails.id} title="Event" onModalClose={onDetailsModalClose}>
    {#if $isCalendarEditing}
      <EditCal calendar={$currentCalendarDetails} />
    {:else}
      <CalDetails calendar={$currentCalendarDetails} />
    {/if}
  </Modal>
{/if}
