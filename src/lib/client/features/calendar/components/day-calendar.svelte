<script lang="ts">
  import { endOfDay, format, isToday, isWithinInterval, startOfDay } from "date-fns";
  import { toZonedTime } from "date-fns-tz";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import { combineDateTimeUTC } from "$lib/shared/utils/time";
  import type { Event } from "$lib/shared/types";

  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface DayCalendarProps {
    events: Event[];
  }

  let { events }: DayCalendarProps = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function getEventDateTimes(event: Event) {
    const startUtc = combineDateTimeUTC(event.startDate, event.startTime);
    const endUtc = combineDateTimeUTC(event.endDate, event.endTime);
    const start = toZonedTime(startUtc, event.timezone);
    const end = toZonedTime(endUtc, event.timezone);
    return { start, end };
  }

  function splitEventByDay(event: Event) {
    const { start, end } = getEventDateTimes(event);
    const dayStart = startOfDay($currentDate);
    const dayEnd = endOfDay($currentDate);

    const chunkStart = start < dayStart ? dayStart : start;
    const chunkEnd = end > dayEnd ? dayEnd : end;

    return { event, start: chunkStart, end: chunkEnd };
  }

  function calculateOffsets(chunks: { event: Event; start: Date; end: Date }[]) {
    chunks.sort((a, b) => a.start.getTime() - b.start.getTime());

    const active: { end: Date; offset: number }[] = [];
    const offsets = new Map<string, number>();

    for (const chunk of chunks) {
      active.filter((a) => a.end > chunk.start);
      const used = new Set(active.map((a) => a.offset));
      let offset = 0;
      while (used.has(offset)) offset++;

      active.push({ end: chunk.end, offset });
      offsets.set(chunk.event.id, offset);
    }
    return offsets;
  }

  const dayEvents = $derived.by(() => {
    const dayStart = startOfDay($currentDate);
    const dayEnd = endOfDay($currentDate);

    const filtered = events.filter((event) => {
      const { start, end } = getEventDateTimes(event);
      const isVisible = !($checkedCalendars[event.calendarId] === false);
      if (!isVisible) return false;
      return (
        isWithinInterval(start, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(end, { start: dayStart, end: dayEnd }) ||
        (start < dayStart && end > dayEnd)
      );
    });

    const chunks = filtered.map(splitEventByDay);
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
    <div class="flex flex-col items-center justify-start gap-1">
      <div
        class={`font-semibold text-center ${isToday($currentDate) ? "text-secondary-content" : ""}`}
      >
        {format($currentDate, "EEEE, MMM d")}
      </div>
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
          {format(new Date(0).setHours(hour), "h a")}
        </div>

        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format($currentDate, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if hour === 0}
            <CurrentTimeIndicator day={$currentDate} />
          {/if}

          {#each dayEvents as { event, start, offset } (event.id + start.toISOString())}
            {#if start.getHours() === hour}
              <EventBlock {event} {offset} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
