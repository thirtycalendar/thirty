<script lang="ts">
  import {
    addDays,
    endOfDay,
    format,
    isToday,
    isWithinInterval,
    setHours,
    startOfDay,
    startOfWeek
  } from "date-fns";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import { getEventDateObjects } from "$lib/shared/utils/time";
  import type { Event } from "$lib/shared/types";

  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface WeekCalendarProps {
    events: Event[];
  }

  let { events }: WeekCalendarProps = $props();

  const days = $derived.by(() => {
    const start = startOfWeek($currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  type EventChunk = { event: Event; day: Date; start: Date; end: Date };

  function splitEventByDay(event: Event): EventChunk[] {
    const { start, end } = getEventDateObjects(event);
    const chunks: EventChunk[] = [];
    let dayCursor = startOfDay(start);

    while (dayCursor < end) {
      const dayEnd = endOfDay(dayCursor);
      const chunkStart = start > dayCursor ? start : dayCursor;
      const chunkEnd = end < dayEnd ? end : dayEnd;

      chunks.push({ event, day: dayCursor, start: chunkStart, end: chunkEnd });
      dayCursor = addDays(dayCursor, 1);
      if (dayCursor > end) break;
    }
    return chunks;
  }

  function calculateOffsets(chunks: EventChunk[]) {
    const offsets = new Map<EventChunk, number>();
    const dayChunksMap = new Map<string, EventChunk[]>();

    for (const chunk of chunks) {
      const dayKey = format(chunk.day, "yyyy-MM-dd");
      if (!dayChunksMap.has(dayKey)) dayChunksMap.set(dayKey, []);
      dayChunksMap.get(dayKey)!.push(chunk);
    }

    for (const [, dayChunks] of dayChunksMap) {
      dayChunks.sort((a, b) => a.start.getTime() - b.start.getTime());
      const activeLanes: { end: Date; offset: number }[] = [];

      for (const chunk of dayChunks) {
        const remainingLanes = activeLanes.filter((lane) => lane.end > chunk.start);
        const usedOffsets = new Set(remainingLanes.map((lane) => lane.offset));
        let offset = 0;
        while (usedOffsets.has(offset)) offset++;
        offsets.set(chunk, offset);
        remainingLanes.push({ end: chunk.end, offset });
        activeLanes.splice(0, activeLanes.length, ...remainingLanes);
      }
    }
    return offsets;
  }

  const weekEvents = $derived.by(() => {
    const weekStart = startOfDay(days[0]);
    const weekEnd = endOfDay(days[6]);

    const filtered = events.filter((event) => {
      const isVisible = $checkedCalendars[event.calendarId] !== false;
      if (!isVisible || event.allDay) return false;

      const { start, end } = getEventDateObjects(event);
      return (
        isWithinInterval(start, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(end, { start: weekStart, end: weekEnd }) ||
        (start < weekStart && end > weekEnd)
      );
    });

    const chunks = filtered.flatMap(splitEventByDay);
    const offsets = calculateOffsets(chunks);

    return chunks.map((chunk) => ({
      ...chunk,
      offset: offsets.get(chunk) ?? 0
    }));
  });

  let scrollContainer: HTMLDivElement;
</script>

<div class="flex flex-col h-full py-3">
  <div class="grid grid-cols-[50px_repeat(7,1fr)] text-xs sm:text-sm bg-base-200 sticky top-0 z-10">
    <div class="border-r border-base-200"></div>
    {#each days as day (day.toISOString())}
      <div class="flex items-center justify-center p-1 border-b border-r border-base-200">
        <span
          class={`font-bold flex items-center gap-1 ${isToday(day) ? "text-primary-content" : "text-primary-content/70"}`}
        >
          {#if isToday(day)}
            <span class="w-2 h-2 rounded-full bg-primary-content"></span>
          {/if}

          {format(day, "EEE")}
          {format(day, "d")}
        </span>
      </div>
    {/each}
  </div>

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden grid grid-cols-[50px_repeat(7,1fr)] rounded-2xl bg-base-100 relative"
  >
    <div class="col-start-1 row-start-1 grid">
      {#each hours as hour (hour)}
        <div
          class="h-15 flex justify-center items-center text-center select-none text-xs text-primary-content/70 border-r border-base-200"
        >
          <span class="relative">
            {format(setHours(new Date(), hour), "h a")}
          </span>
        </div>
      {/each}
    </div>

    {#each days as day, i (day.toISOString())}
      <div
        class="relative grid grid-rows-24 border-r border-base-200"
        style="grid-column: {i + 2}; grid-row: 1;"
      >
        {#each hours as hour (hour)}
          <div class="h-15 border-b border-base-200"></div>
        {/each}

        <div class="absolute inset-0">
          {#each weekEvents.filter((e) => format(e.day, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) as { event, start, end, offset } (event.id + start.toISOString())}
            <EventBlock {event} {start} {end} {offset} />
          {/each}
        </div>

        {#if isToday(day)}
          <CurrentTimeIndicator {day} />
        {/if}
      </div>
    {/each}
  </div>
</div>
