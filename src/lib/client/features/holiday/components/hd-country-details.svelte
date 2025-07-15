<script lang="ts">
  import { Palette } from "@lucide/svelte";

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

  <h2 class="text-xl font-semibold">{holidayCountry.countryName} ({holidayCountry.countryCode})</h2>

  <div class="flex items-start gap-3">
    <div class="pt-0.5 text-muted-foreground">
      <Palette size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1 flex items-center gap-2">
      <span class="capitalize">Color:</span>
      <div
        class="w-5 aspect-square rounded-full"
        style="background-color: {getColorHexCodeFromId(holidayCountry.colorId)}"
      ></div>
    </div>
  </div>

  <HdCountryActionButtons id={holidayCountry.id} bind:errorMessage />
</div>
