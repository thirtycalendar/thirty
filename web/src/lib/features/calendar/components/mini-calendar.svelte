<script lang="ts">
  import { derived } from "svelte/store";
  import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isToday,
    format,
    isSameMonth,
  } from "date-fns";
  import { currentDate } from "$lib/stores/change-date";

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek(startOfMonth($currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth($currentDate), { weekStartsOn: 0 });

    const result: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      result.push(d);
    }
    return result;
  });
</script>

<div class="text-[10px] w-full select-none">
  <div class="text-center font-semibold mb-2 text-sm">
    {format($currentDate, "MMMM yyyy")}
  </div>

  <!-- Day labels -->
  <div class="grid grid-cols-7 gap-1 text-center opacity-50 mb-1">
    {#each dayLabels as label}
      <div>{label}</div>
    {/each}
  </div>

  <!-- Mini month grid -->
  <div class="grid grid-cols-7 gap-1 text-center">
    {#each $days as day}
      <div
        class={`rounded-md py-[2px] transition-colors
          ${isToday(day) ? "bg-base-300 text-primary-content font-semibold" : ""}
          ${!isSameMonth(day, $currentDate) ? "text-base-content/30" : ""}
          hover:bg-base-300/50 cursor-pointer`}
        title={format(day, "PPP")}
      >
        {format(day, "d")}
      </div>
    {/each}
  </div>
</div>
