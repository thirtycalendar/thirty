<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { holidayModal } from "$lib/client/stores/modal";

  import { HdDetails } from ".";

  const { currentDetails } = holidayModal;
</script>

{#if $currentDetails}
  <Modal modalId={$currentDetails.id} title="Holiday">
    <HdDetails holiday={$currentDetails} />
  </Modal>
{/if}
