<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { birthdayModal } from "$lib/client/stores/modal";

  import { BdDetails, CreateBd, EditBd } from ".";

  const { modalId, currentDetails, isEditing, stopEditing } = birthdayModal;
</script>

<Modal {modalId} title="Birthday"><CreateBd /></Modal>

{#if $currentDetails}
  <Modal modalId={$currentDetails.id} title="Birthday" onModalClose={stopEditing}>
    {#if $isEditing}
      <EditBd birthday={$currentDetails} />
    {:else}
      <BdDetails birthday={$currentDetails} />
    {/if}
  </Modal>
{/if}
