<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { derived } from "svelte/store";

  import {
    startOfWeek,
    addDays,
    format,
    setHours,
    isToday,
    differenceInMinutes,
    startOfDay,
  } from "date-fns";
  import { currentDate } from "$lib/stores/week-date";

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek($currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  let now = new Date();
  let timer: ReturnType<typeof setInterval>;

  onMount(() => {
    timer = setInterval(() => {
      now = new Date();
    }, 60 * 1000); // update every minute
  });

  onDestroy(() => clearInterval(timer));

  const getLineOffset = () => {
    const minutes = differenceInMinutes(now, startOfDay(now));
    return (minutes / 60) * 60; // if 60px = 1 hour
  };
</script>

<div class="flex flex-col h-full py-3">
  <!-- Day Headers -->
  <div
    class="grid grid-cols-[50px_repeat(7,1fr)] text-sm bg-base-200 sticky top-0 z-10"
  >
    <div></div>
    {#each $days as day}
      <div
        class="h-8 flex flex-col border-b border-base-200 items-center justify-center relative"
      >
        <div class={`font-semibold ${isToday(day) ? "text-primary" : ""}`}>
          {format(day, "EEE d")}
        </div>
      </div>
    {/each}
  </div>

  <!-- Time Grid -->
  <div
    class="flex-1 overflow-y-auto grid grid-cols-[50px_repeat(7,1fr)] text-xs rounded-2xl bg-base-100 relative"
  >
    {#each hours as hour}
      <!-- Time Label -->
      <div
        class="h-15 flex justify-center items-center select-none leading-none text-primary-content/70 border-r border-base-200"
      >
        {format(setHours(new Date(), hour), "h a")}
      </div>

      <!-- Hour Blocks -->
      {#each $days as day}
        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format(day, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if isToday(day) && hour === 0}
            <div
              class="absolute left-0 right-0 h-px bg-red-500"
              style={`top: ${getLineOffset()}px`}
            ></div>
          {/if}
        </div>
      {/each}
    {/each}
  </div>
</div>
