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

  import { changeToDayView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";

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

<div class="bg-base-100/70 mt-3 mb-1 h-full overflow-y-auto rounded-2xl">
  <div class="grid grid-cols-1 gap-6 p-4 text-[10px] leading-tight sm:grid-cols-2 md:grid-cols-3">
    {#each $months as month (month)}
      <div class="flex flex-col">
        <div class="mb-1 text-center text-xs font-semibold">
          {format(month, "MMMM")}
        </div>
        <div class="mb-1 grid grid-cols-7 text-center opacity-60">
          {#each dayLabels as d, i (i)}
            <div>{d}</div>
          {/each}
        </div>
        <div class="grid grid-cols-7 items-center justify-center gap-1 text-center">
          {#each getDays(month) as day (day)}
            <button
              class={`hover:bg-base-200 rounded-md p-[2px] ${
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
