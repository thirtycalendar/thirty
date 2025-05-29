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

  import { changeToDayView } from "$lib/ui/stores/cal-view";
  import { currentDate } from "$lib/ui/stores/change-date";

  const months = derived(currentDate, ($currentDate) => {
    const year = $currentDate.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  });

  const getDays = (month: Date) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  };

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
</script>

<div class="bg-base-100/70 my-3 rounded-2xl h-full overflow-y-auto">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-[10px] leading-tight p-4">
    {#each $months as month}
      <div class="flex flex-col">
        <div class="text-center font-semibold mb-1 text-xs">
          {format(month, "MMMM")}
        </div>
        <div class="grid grid-cols-7 text-center mb-1 opacity-60">
          {#each dayLabels as d}
            <div>{d}</div>
          {/each}
        </div>
        <div class="grid grid-cols-7 text-center gap-1 items-center justify-center">
          {#each getDays(month) as day}
            <button
              class={`p-[2px] rounded-md ${
                isToday(day) ? "bg-base-300 font-semibold" : ""
              } ${!isSameMonth(day, month) ? "text-base-content/30" : ""}`}
              onclick={() => {
                currentDate.set(day);
                changeToDayView();
              }}
            >
              {format(day, "d")}
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
