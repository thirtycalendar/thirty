<script lang="ts">
  import { writable, derived } from "svelte/store";
  import {
    startOfWeek,
    addDays,
    addWeeks,
    subWeeks,
    format,
    setHours,
  } from "date-fns";

  const currentDate = writable(new Date());

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek($currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 - 23 hours

  const goToToday = () => currentDate.set(new Date());
  const goToNextWeek = () => currentDate.update((d) => addWeeks(d, 1));
  const goToPreviousWeek = () => currentDate.update((d) => subWeeks(d, 1));
</script>

<!-- Header Buttons -->
<div class="flex justify-between items-center mb-4">
  <div class="space-x-2">
    <button on:click={goToPreviousWeek} class="btn btn-sm">Last Week</button>
    <button on:click={goToToday} class="btn btn-sm">Today</button>
    <button on:click={goToNextWeek} class="btn btn-sm">Next Week</button>
  </div>
</div>

<!-- Day Headers -->
<div
  class="grid grid-cols-[60px_repeat(7,1fr)] border-b text-sm font-semibold text-center"
>
  <div></div>
  {#each $days as day}
    <div class="p-2 bg-base-200 border-l">
      <div>{format(day, "EEE")}</div>
      <div>{format(day, "MMM d")}</div>
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
