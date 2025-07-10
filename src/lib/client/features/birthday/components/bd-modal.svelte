<script lang="ts">
  import { Modal } from "$lib/client/components";
  import {
    birthdayCreateModalId,
    currentBirthdayDetails,
    handleBirthdayStopEditing,
    isBirthdayEditing
  } from "$lib/client/stores/birthday";

  import { BdDetails, CreateBd, EditBd } from ".";

  function onDetailsModalClose() {
    handleBirthdayStopEditing();
  }
</script>

<Modal modalId={birthdayCreateModalId} title="Birthday"><CreateBd /></Modal>

{#if $currentBirthdayDetails}
  <Modal modalId={$currentBirthdayDetails.id} title="Birthday" onModalClose={onDetailsModalClose}>
    {#if $isBirthdayEditing}
      <EditBd birthday={$currentBirthdayDetails} />
    {:else}
      <BdDetails birthday={$currentBirthdayDetails} />
    {/if}
  </Modal>
{/if}
