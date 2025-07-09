<script lang="ts">
  import { endOfDay, format, isToday, setHours, startOfDay } from "date-fns";

  import { calculateEventOffsets, getEventDateObjects } from "$lib/client/features/event/utils";
  import { currentDate } from "$lib/client/stores/change-date";

  import type { Event } from "$lib/shared/types";

  import { AllDayEventBlock, EventBlock } from "../../event/components";
  import { getVisibleEvents } from "../utils";

  import { CurrentTimeIndicator } from ".";

  interface DayCalendarProps {
    events: Event[];
  }

  let { events }: DayCalendarProps = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayStart = $derived(startOfDay($currentDate));
  const dayEnd = $derived(endOfDay($currentDate));

  const { allDayEvents, timedEvents } = $derived.by(() =>
    getVisibleEvents(events, dayStart, dayEnd)
  );

  const timedEventChunks = $derived.by(() => {
    const chunks = timedEvents.map((event) => {
      const { start, end } = getEventDateObjects(event);
      return {
        event,
        start: start < dayStart ? dayStart : start,
        end: end > dayEnd ? dayEnd : end
      };
    });
    const offsets = calculateEventOffsets(chunks);
    return chunks.map((chunk) => ({ ...chunk, offset: offsets.get(chunk) ?? 0 }));
  });

  let scrollContainer: HTMLDivElement;
</script>

<div class="flex flex-col h-full px-2">
  <div class="bg-base-200 sticky top-0 z-10 border-b border-base-200 px-1 py-1">
    <div
      class={`font-semibold text-center ${isToday($currentDate) ? "text-primary-content" : "text-primary-content/70"}`}
    >
      {format($currentDate, "EEEE, MMM d")}
    </div>
  </div>

  {#if allDayEvents.length > 0}
    <div class="bg-base-200 border-b border-base-200 grid grid-cols-[50px_1fr]">
      <div></div>
      <div class="flex flex-col gap-1 py-1">
        {#each allDayEvents as event (event.id)}
          <AllDayEventBlock {event} />
        {/each}
      </div>
    </div>
  {/if}

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden bg-base-100 relative rounded-2xl"
  >
    <div class="grid grid-cols-[50px_1fr] relative">
      {#each hours as hour (hour)}
        <div
          class="col-start-1 h-15 flex justify-center items-center select-none leading-none text-xs text-primary-content/70 border-r border-b border-base-200"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>
        <div class="col-start-2 border-b border-base-200"></div>
      {/each}

      <div class="col-start-2 row-start-1 col-span-1 row-span-full relative pointer-events-none">
        <div class="absolute inset-0 pointer-events-auto">
          {#each timedEventChunks as { event, start, end, offset } (event.id)}
            <EventBlock {event} {start} {end} {offset} />
          {/each}

          {#if isToday($currentDate)}
            <CurrentTimeIndicator day={$currentDate} />
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
