<script lang="ts">
  import { derived } from "svelte/store";

  import {
    addDays,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek
  } from "date-fns";

  import { currentDate, goToNextMonth, goToPreviousMonth } from "$lib/client/stores/change-date";

  import { ChevronLeft, ChevronRight } from "../icons";

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

<div class="my-3 w-full text-[10px] select-none">
  <div class="mb-2 flex items-center justify-between text-sm font-semibold">
    <p class="text-primary-content/90 ml-3">{format($currentDate, "MMMM yyyy")}</p>

    <div>
      <button class="btn btn-xs btn-square btn-ghost" onclick={goToPreviousMonth}>
        <ChevronLeft size="20" />
      </button>
      <button class="btn btn-xs btn-square btn-ghost" onclick={goToNextMonth}>
        <ChevronRight size="20" />
      </button>
    </div>
  </div>

  <!-- Day labels -->
  <div class="mb-1 grid grid-cols-7 gap-1 text-center opacity-50">
    {#each dayLabels as label, i (i)}
      <div>{label}</div>
    {/each}
  </div>

  <!-- Mini month grid -->
  <div class="grid grid-cols-7 gap-1 text-center">
    {#each $days as day (day)}
      <button
        class={`rounded-md py-[2px] transition-colors
          ${isToday(day) ? "bg-base-300 text-primary-content font-semibold" : ""}
          ${!isSameMonth(day, $currentDate) ? "text-base-content/30" : ""}
          hover:bg-base-300/50 cursor-pointer`}
        title={format(day, "PPP")}
        onclick={() => currentDate.set(day)}
      >
        {format(day, "d")}
      </button>
    {/each}
  </div>
</div>
