<script lang="ts">
  import { holidayCountryModalStore, holidayModalStore } from "$lib/client/stores/modal";

  import { DraggableModal } from "..";
  import { AddHolidayCountry, HolidayCountryDetails, HolidayDetails } from ".";

  const { activeItem: holiday } = holidayModalStore;
  const { modalId: holidayCountryModalId, activeItem: holidayCountry } = holidayCountryModalStore;
</script>

{#if $holiday}
  <DraggableModal id={$holiday.id} title="Holiday">
    <HolidayDetails holiday={$holiday} />
  </DraggableModal>
{/if}

<DraggableModal id={holidayCountryModalId} title="Holiday"><AddHolidayCountry /></DraggableModal>

{#if $holidayCountry}
  <DraggableModal id={$holidayCountry.id} title="Holiday">
    <HolidayCountryDetails holidayCountry={$holidayCountry} />
  </DraggableModal>
{/if}
