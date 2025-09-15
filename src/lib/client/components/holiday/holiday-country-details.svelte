<script lang="ts">
  import type { HolidayCountry } from "$lib/shared/types";

  import { HolidayCountryActionButtons } from ".";

  interface Props {
    holidayCountry: HolidayCountry;
  }

  let { holidayCountry }: Props = $props();

  let prevId = $derived(holidayCountry.id);
  let errorMessage = $derived(prevId !== holidayCountry.id ? "" : "");
</script>

<div class="detail-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <h2 class="detail-title">
    <div
      class="aspect-square w-5 rounded-full"
      style="background-color: {holidayCountry.color}"
    ></div>
    {holidayCountry.countryName} ({holidayCountry.countryCode})
  </h2>

  <HolidayCountryActionButtons id={holidayCountry.id} bind:errorMessage />
</div>
