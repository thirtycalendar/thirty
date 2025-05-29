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

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek(startOfMonth($currentDate));
    const end = endOfWeek(endOfMonth($currentDate));

    const result: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      result.push(d);
    }
    return result;
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
</script>

<div class="flex flex-col h-full py-3">
  <!-- Day Headers -->
  <div class="grid grid-cols-7 bg-base-200 text-sm sticky top-0 z-10">
    {#each dayLabels as label}
      <div class="h-8 flex items-center justify-center font-semibold">
        {label}
      </div>
    {/each}
  </div>

  <!-- Month Grid -->
  <div class="grid grid-cols-7 row-5 h-full bg-base-100 text-xs rounded-2xl w-full relative">
    {#each $days as day}
      <button
        class="border border-base-200 px-2 py-1 relative hover:bg-base-300/10 transition-colors"
        data-day={format(day, "yyyy-MM-dd")}
        onclick={() => {
          currentDate.set(day);
          changeToDayView();
        }}
      >
        <div class="text-xs font-medium absolute top-1 right-1">
          <span
            class={`select-none ${
              isToday(day)
                ? "text-primary bg-primary-content font-bold rounded p-[1px]"
                : !isSameMonth(day, $currentDate)
                  ? "text-base-content/40"
                  : ""
            }`}
          >
            {format(day, "d")}
          </span>
        </div>

        <!-- Event slot -->
        <div class="absolute inset-x-1 top-6 space-y-1 text-[10px] leading-tight">
          <!-- Inject events here -->
        </div>
      </button>
    {/each}
  </div>
</div>
