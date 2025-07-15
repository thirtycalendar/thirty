<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { currentHdDetails } from "$lib/client/stores/holiday";

  import { HdDetails } from ".";
</script>

{#if $currentHdDetails}
  <Modal modalId={$currentHdDetails.id} title="Holiday">
    <HdDetails holiday={$currentHdDetails} />
  </Modal>
{/if}
