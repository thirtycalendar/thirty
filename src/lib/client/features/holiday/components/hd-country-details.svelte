<script lang="ts">
  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { HolidayCountry } from "$lib/shared/types";

  import { HdCountryActionButtons } from ".";

  interface Props {
    holidayCountry: HolidayCountry;
  }

  let { holidayCountry }: Props = $props();

  let previousHdCountryId = $derived(holidayCountry.id);
  let errorMessage = $derived(previousHdCountryId !== holidayCountry.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold flex items-center gap-2">
    <div
      class="w-5 aspect-square rounded-full"
      style="background-color: {getColorHexCodeFromId(holidayCountry.colorId)}"
    ></div>
    {holidayCountry.countryName} ({holidayCountry.countryCode})
  </h2>

  <HdCountryActionButtons id={holidayCountry.id} bind:errorMessage />
</div>
