<script lang="ts">
  import { derived } from "svelte/store";
  import { startOfWeek, addDays, format, setHours, isToday } from "date-fns";
  import { currentDate } from "$lib/stores/week-date";

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek($currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
</script>

<!-- Day Headers -->
<div
  class="grid grid-cols-[50px_repeat(7,1fr)] sticky top-0 z-10 bg-base-100/80 backdrop-blur border-b border-base-200 shadow-sm text-sm rounded-xl mb-2"
>
  <div></div>
  {#each $days as day}
    <div
      class="h-14 flex flex-col items-center justify-center border-l border-base-200 relative"
    >
      <div class={`font-semibold ${isToday(day) ? "text-primary" : ""}`}>
        {format(day, "EEE d")}
      </div>
    </div>
  {/each}
</div>

<!-- Time Grid -->
<div
  class="grid grid-cols-[50px_repeat(7,1fr)] text-xs bg-base-100 rounded-2xl"
>
  {#each hours as hour}
    <!-- Time Label -->
    <div
      class="h-16 pr-2 pt-1 text-right text-base-content/40 font-mono select-none leading-none"
    >
      {format(setHours(new Date(), hour), "h a")}
    </div>

    <!-- Hour Blocks -->
    {#each $days as day}
      <div
        class={`relative h-16 border border-base-200
          ${isToday(day) ? "bg-blue-500/5" : ""}
          hover:bg-base-300/10 transition-colors`}
        data-day={format(day, "yyyy-MM-dd")}
        data-hour={hour}
      >
        <div
          class="absolute top-1 right-2 text-blue-500 text-xs opacity-0 group-hover:opacity-100 transition"
        >
          +
        </div>
      </div>
    {/each}
  {/each}
</div>
