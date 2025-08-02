<script lang="ts">
  import { Flag } from "@lucide/svelte";

  import { holidayModal } from "$lib/client/stores/modal";

  import type { Holiday } from "$lib/shared/types";

  import { getHolidayCountries } from "../query";

  interface Props {
    holiday: Holiday;
  }

  let { holiday }: Props = $props();

  const { data: hdCountries } = getHolidayCountries();

  const color = $derived.by(() => {
    const color = $hdCountries?.find((c) => c.id === holiday.countryId)?.color ?? "transparent";
    return color;
  });
</script>

<button
  class="text-primary-content border-primary-content/10 flex w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-xl border p-0 text-left shadow-sm backdrop-blur-md select-none"
  style:background-color="{color}33"
  title={holiday.name}
  onclick={() => holidayModal.handleModal(holiday)}
>
  <div class="h-full w-1 shrink-0" style:background-color={color}></div>
  <div class="w-full min-w-0 overflow-hidden p-0.5 text-xs font-medium">
    <div class="flex min-w-0 items-center gap-1">
      <Flag size="13" strokeWidth="2.5" class="flex-shrink-0" />
      <p class="truncate">{holiday.name}</p>
    </div>
  </div>
</button>
