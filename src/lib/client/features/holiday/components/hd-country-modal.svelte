<script lang="ts">
  import { Modal } from "$lib/client/components";
  import { currentHdCountryDetails, hdCountryAddModalId } from "$lib/client/stores/holiday";

  import { AddHdCountry, HdCountryDetails } from ".";
</script>

<Modal modalId={hdCountryAddModalId} title="Holiday"><AddHdCountry /></Modal>

{#if $currentHdCountryDetails}
  <Modal modalId={$currentHdCountryDetails.id} title="Holiday">
    <HdCountryDetails holidayCountry={$currentHdCountryDetails} />
  </Modal>
{/if}
