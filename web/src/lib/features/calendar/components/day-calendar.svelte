<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import {
    format,
    setHours,
    isToday,
    differenceInMinutes,
    startOfDay,
  } from "date-fns";

  let date = new Date();

  let scrollContainer: HTMLDivElement;
  let now = new Date();
  let timer: ReturnType<typeof setInterval>;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getLineOffset = () => {
    const minutes = differenceInMinutes(now, startOfDay(now));
    return (minutes / 60) * 60; // 60px per hour height
  };

  async function scrollToCurrentTime() {
    await tick();
    if (scrollContainer) {
      scrollContainer.scrollTop = getLineOffset();
    }
  }

  onMount(() => {
    scrollToCurrentTime();

    timer = setInterval(() => {
      now = new Date();
      scrollToCurrentTime();
    }, 60 * 1000);
  });

  onDestroy(() => clearInterval(timer));
</script>

<div class="flex flex-col h-full py-3">
  <!-- Day Header -->
  <div
    class="h-8 flex items-center justify-center text-sm bg-base-200 border-b border-base-200 sticky top-0 z-10"
  >
    <div class={`font-semibold ${isToday(date) ? "text-primary" : ""}`}>
      {format(date, "EEEE, MMM d")}
    </div>
  </div>

  <!-- Time Grid -->
  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto bg-base-100 relative rounded-2xl text-xs"
  >
    <div class="grid grid-cols-[50px_1fr]">
      {#each hours as hour}
        <!-- Time Label -->
        <div
          class="h-15 flex justify-center items-center select-none leading-none text-primary-content/70 border-r border-base-200"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>

        <!-- Hour Block -->
        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format(date, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if isToday(date) && hour === 0}
            <div
              class="absolute left-0 right-0 h-px bg-red-500"
              style={`top: ${getLineOffset()}px`}
            ></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
