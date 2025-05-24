<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isToday,
    isSameDay,
    isSameMonth,
  } from "date-fns";

  let value: Date = $state(new Date());
  let open = $state(false);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const getDays = () => {
    const start = startOfWeek(startOfMonth(value), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(value), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  };

  function selectDay(day: Date) {
    value = day;
    open = false;
  }

  function prevMonth() {
    value = subMonths(value, 1);
  }

  function nextMonth() {
    value = addMonths(value, 1);
  }
</script>

<div class="relative w-full">
  <!-- Trigger Button -->
  <button
    type="button"
    class="w-full px-3 py-2 border border-base-300 rounded-md text-sm bg-base-100 hover:bg-base-200 text-left"
    onclick={() => (open = !open)}
  >
    {format(value, "EEE d, MMM")}
  </button>

  {#if open}
    <div
      class="absolute mt-1 z-50 w-72 p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl"
    >
      <!-- Month Navigation -->
      <div
        class="flex items-center justify-between px-2 mb-2 text-sm font-semibold"
      >
        <div class=" w-full">
          {format(value, "MMMM yyyy")}
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-xs btn-square"
          onclick={prevMonth}
          aria-label="Previous Month"
        >
          <ChevronLeft size="15" />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-xs btn-square"
          onclick={nextMonth}
          aria-label="Next Month"
        >
          <ChevronRight size="15" />
        </button>
      </div>

      <!-- Day Labels -->
      <div class="grid grid-cols-7 text-[10px] text-center opacity-50 mb-1">
        {#each dayLabels as label}
          <div>{label}</div>
        {/each}
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        {#each getDays() as day}
          <button
            type="button"
            class={`py-1 rounded-md cursor-pointer transition-colors w-full
              ${isSameDay(day, value) ? "bg-base-200 text-primary-content font-semibold" : ""}
              ${!isSameMonth(day, value) ? "text-base-content/30" : ""}
              ${isToday(day) && isSameDay(day, value) ? "text-primary font-medium" : ""}
              hover:bg-base-300/60`}
            onclick={() => selectDay(day)}
          >
            {format(day, "d")}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
