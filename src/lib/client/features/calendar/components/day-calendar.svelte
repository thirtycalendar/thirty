<script lang="ts">
  import { endOfDay, format, isToday, isWithinInterval, setHours, startOfDay } from "date-fns";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import { getEventDateObjects } from "$lib/shared/utils/time";
  import type { Event } from "$lib/shared/types";

  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface DayCalendarProps {
    events: Event[];
  }
  let { events }: DayCalendarProps = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  type EventChunk = { event: Event; start: Date; end: Date };

  function calculateOffsets(chunks: EventChunk[]) {
    chunks.sort((a, b) => a.start.getTime() - b.start.getTime());
    const offsets = new Map<string, number>();
    const activeLanes: { end: Date; offset: number }[] = [];

    for (const chunk of chunks) {
      const remainingLanes = activeLanes.filter((lane) => lane.end > chunk.start);
      const usedOffsets = new Set(remainingLanes.map((lane) => lane.offset));
      let offset = 0;
      while (usedOffsets.has(offset)) {
        offset++;
      }
      offsets.set(chunk.event.id, offset);
      remainingLanes.push({ end: chunk.end, offset });
      activeLanes.splice(0, activeLanes.length, ...remainingLanes);
    }
    return offsets;
  }

  const dayEvents = $derived.by(() => {
    const dayStart = startOfDay($currentDate);
    const dayEnd = endOfDay($currentDate);

    const filtered = events.filter((event) => {
      const isVisible = $checkedCalendars[event.calendarId] !== false;
      if (!isVisible || event.allDay) return false;

      const { start, end } = getEventDateObjects(event);
      return (
        isWithinInterval(start, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(end, { start: dayStart, end: dayEnd }) ||
        (start < dayStart && end > dayEnd)
      );
    });

    const chunks = filtered.map((event) => {
      const { start, end } = getEventDateObjects(event);
      const chunkStart = start < dayStart ? dayStart : start;
      const chunkEnd = end > dayEnd ? dayEnd : end;
      return { event, start: chunkStart, end: chunkEnd };
    });

    const offsets = calculateOffsets(chunks);
    return chunks.map((chunk) => ({
      ...chunk,
      offset: offsets.get(chunk.event.id) ?? 0
    }));
  });

  let scrollContainer: HTMLDivElement;
</script>

<div class="flex flex-col h-full py-3">
  <div class="bg-base-200 sticky top-0 z-10 border-b border-base-200 px-1 py-1">
    <div class="font-semibold text-center {isToday($currentDate) ? 'text-secondary-content' : ''}">
      {format($currentDate, "EEEE, MMM d")}
    </div>
  </div>

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden bg-base-100 relative rounded-2xl"
  >
    <div class="grid grid-cols-[50px_1fr]">
      {#each hours as hour (hour)}
        <div
          class="h-15 flex justify-center items-center select-none leading-none text-xs text-primary-content/70 border-r border-base-200"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>
        <div class="relative h-15 border-b border-base-200"></div>
      {/each}

      <div class="col-start-2 row-start-1 row-span-full relative">
        {#each dayEvents as { event, start, end, offset } (event.id)}
          <EventBlock {event} {start} {end} {offset} />
        {/each}

        {#if isToday($currentDate)}
          <CurrentTimeIndicator day={$currentDate} />
        {/if}
      </div>
    </div>
  </div>
</div>
