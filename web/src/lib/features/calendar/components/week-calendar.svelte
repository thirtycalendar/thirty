<script lang="ts">
  import { derived } from "svelte/store";
  import { startOfWeek, addDays, format, setHours } from "date-fns";

  import { currentDate } from "$lib/stores/week-date";

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek($currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23 hours
</script>

<!-- Day Headers -->
<div
  class="grid grid-cols-[60px_repeat(7,1fr)] border-b text-sm font-semibold text-center"
>
  <div></div>
  {#each $days as day}
    <div class="p-2 bg-base-200 border-l">
      <div>{format(day, "EEE d")}</div>
    </div>
  {/each}
</div>

<!-- Time Grid -->
<div class="grid grid-cols-[60px_repeat(7,1fr)]">
  {#each hours as hour}
    <!-- Time Label Column -->
    <div
      class="border-t px-1 py-0.5 text-xs text-right align-top leading-none h-12"
    >
      {format(setHours(new Date(), hour), "haaa").replace(":00", "")}
    </div>

    <!-- Hour Blocks -->
    {#each $days as day}
      <div
        class="border-t border-l h-12 hover:bg-base-300 cursor-pointer"
        data-day={format(day, "yyyy-MM-dd")}
        data-hour={hour}
      ></div>
    {/each}
  {/each}
</div>
