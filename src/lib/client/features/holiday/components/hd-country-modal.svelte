<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { holidayCountryModal } from "$lib/client/stores/modal";

  import { AddHdCountry, HdCountryDetails } from ".";

  const { modalId, currentDetails } = holidayCountryModal;
</script>

<Modal {modalId} title="Holiday"><AddHdCountry /></Modal>

{#if $currentDetails}
  <Modal modalId={$currentDetails.id} title="Holiday">
    <HdCountryDetails holidayCountry={$currentDetails} />
  </Modal>
{/if}
