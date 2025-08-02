<script lang="ts">
  import type { HolidayCountry } from "$lib/shared/types";

  import { HdCountryActionButtons } from ".";

  interface Props {
    holidayCountry: HolidayCountry;
  }

  let { holidayCountry }: Props = $props();

  let prevId = $derived(holidayCountry.id);
  let errorMessage = $derived(prevId !== holidayCountry.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <h2 class="flex items-center gap-2 text-xl font-semibold">
    <div
      class="aspect-square w-5 rounded-full"
      style="background-color: {holidayCountry.color}"
    ></div>
    {holidayCountry.countryName} ({holidayCountry.countryCode})
  </h2>

  <HdCountryActionButtons id={holidayCountry.id} bind:errorMessage />
</div>
