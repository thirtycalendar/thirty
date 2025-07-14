<script lang="ts">
  import { handleHdModal } from "$lib/client/stores/holiday";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Holiday } from "$lib/shared/types";

  import { getHolidayCountries } from "../query";

  interface Props {
    holiday: Holiday;
  }

  let { holiday }: Props = $props();

  const { data: hdCountries } = getHolidayCountries();
  const hdColor = $derived.by(() => {
    const colorId = $hdCountries?.find((c) => c.id === holiday.countryId)?.colorId ?? "-1";
    return getColorHexCodeFromId(colorId);
  });
</script>

<button
  class="text-primary-content w-full cursor-pointer select-none overflow-hidden rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-primary-content/10 shadow-sm p-0 text-left"
  style:background-color="{hdColor}33"
  title={holiday.name}
  onclick={() => handleHdModal(holiday)}
>
  <div class="w-1 h-full shrink-0" style:background-color={hdColor}></div>
  <div class="p-0.5 overflow-hidden min-w-0 w-full text-xs font-medium">
    <p class="truncate">{holiday.name}</p>
  </div>
</button>
