<script lang="ts">
  import { endOfDay, format, isToday, isWithinInterval, startOfDay } from "date-fns";
  import { toZonedTime } from "date-fns-tz";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event } from "$lib/types";

  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface DayCalendarProps {
    events: Event[];
  }

  let { events }: DayCalendarProps = $props();

  let scrollContainer: HTMLDivElement;
  let now = $state(new Date());
  let timer: ReturnType<typeof setInterval>;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const calendarTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function splitEventByDay(event: Event, dayStart: Date) {
    const eventStartTz = toZonedTime(event.start, calendarTimezone);
    const eventEndTz = toZonedTime(event.end, calendarTimezone);
    const dayEnd = endOfDay(dayStart);

    const start = eventStartTz < dayStart ? dayStart : eventStartTz;
    const end = eventEndTz > dayEnd ? dayEnd : eventEndTz;

    return { event, start, end };
  }

  function calculateOffsets(chunks: { event: Event; start: Date; end: Date }[]) {
    chunks.sort((a, b) => a.start.getTime() - b.start.getTime());

    const offsets = new Map<string, number>();
    const active: { end: Date; offset: number }[] = [];

    for (const current of chunks) {
      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].end <= current.start) active.splice(i, 1);
      }

      const usedOffsets = new Set(active.map((a) => a.offset));
      let offset = 0;
      while (usedOffsets.has(offset)) offset++;

      offsets.set(current.event.id, offset);
      active.push({ end: current.end, offset });
    }
    return offsets;
  }

  const dayEvents = $derived.by(() => {
    const dayStart = startOfDay($currentDate);
    const dayEnd = endOfDay($currentDate);

    const filtered = events.filter((event) => {
      const isVisible = !($checkedCalendars[event.calendarId] === false);
      if (!isVisible) return false;

      const eventStartTz = toZonedTime(event.start, calendarTimezone);
      const eventEndTz = toZonedTime(event.end, calendarTimezone);

      return (
        isWithinInterval(eventStartTz, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(eventEndTz, { start: dayStart, end: dayEnd }) ||
        (eventStartTz < dayStart && eventEndTz > dayEnd)
      );
    });

    const chunks = filtered.map((event) => splitEventByDay(event, dayStart));
    const offsets = calculateOffsets(chunks);

    return { chunks, offsets };
  });
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
      {#each hours as hour}
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

          {#each dayEvents.chunks as { event, start }}
            {#if start.getHours() === hour}
              <EventBlock
                event={{ ...event, start: start.toISOString() }}
                offset={dayEvents.offsets.get(event.id) ?? 0}
              />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
