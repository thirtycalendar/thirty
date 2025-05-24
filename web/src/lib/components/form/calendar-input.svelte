<script lang="ts">
  import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isToday,
    isSameDay,
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
      <div class="text-center font-semibold text-sm mb-2">
        {format(value, "MMMM yyyy")}
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
            class={`py-1 rounded-md cursor-pointer transition-colors
              ${isSameDay(day, value) ? "bg-base-200 text-primary-content font-semibold" : ""}
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
