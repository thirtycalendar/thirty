<script lang="ts">
  import { derived } from "svelte/store";

  import { addDays, format, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";

  import { setDayView } from "$lib/client/stores/calendar-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import { cn } from "$lib/client/utils/cn";

  const months = derived(currentDate, ($currentDate) => {
    const year = $currentDate.getFullYear();
    return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  });

  function getDays(month: Date) {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
    const days: Date[] = [];
    let d = start;

    for (let i = 0; i < 42; i++) {
      days.push(d);
      d = addDays(d, 1);
    }

    return days;
  }

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
</script>

<div class="relative flex-1 overflow-y-auto">
  <div class="grid grid-cols-1 gap-6 leading-tight sm:grid-cols-2 md:grid-cols-3">
    {#each $months as month (month)}
      <div class="flex flex-col">
        <!-- Month name -->
        <div class="text-primary-content/70 mb-1 text-center text-xs">
          <span>{format(month, "MMMM")}</span>
        </div>

        <!-- Day label -->
        <div class="mb-1 grid grid-cols-7 text-center align-middle text-xs opacity-60">
          {#each dayLabels as d, i (i)}
            <span>{d}</span>
          {/each}
        </div>

        <!-- Days -->
        <div class="grid grid-cols-7 gap-1 text-center">
          {#each getDays(month) as day (day)}
            <div class="flex justify-center">
              <button
                class={cn(
                  "btn btn-xs btn-square font-normal",
                  isToday(day) ? "btn-accent" : "btn-ghost text-primary-content/70",
                  !isSameMonth(day, month) && "text-base-content/30"
                )}
                onclick={() => {
                  currentDate.set(day);
                  setDayView();
                }}
              >
                {format(day, "d")}
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
