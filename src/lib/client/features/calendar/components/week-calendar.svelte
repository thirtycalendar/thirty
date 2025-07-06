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
  import { toZonedTime } from "date-fns-tz";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event } from "$lib/shared/types";

  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface WeekCalendarProps {
    events: Event[];
  }

  let { events }: WeekCalendarProps = $props();

  const calendarTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const days = $derived.by(() => {
    const start = startOfWeek($currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function splitEventByDay(event: Event) {
    const chunks: { event: Event; day: Date; start: Date; end: Date }[] = [];
    const eventStartTz = toZonedTime(event.start, calendarTimezone);
    const eventEndTz = toZonedTime(event.end, calendarTimezone);

    let currentStart = eventStartTz;
    while (currentStart < eventEndTz) {
      const dayStart = startOfDay(currentStart);
      const dayEnd = endOfDay(currentStart);
      const chunkEnd = eventEndTz < dayEnd ? eventEndTz : dayEnd;

      chunks.push({ event, day: dayStart, start: currentStart, end: chunkEnd });
      currentStart = addDays(dayStart, 1);
    }
    return chunks;
  }

  function calculateOffsets(chunks: { event: Event; day: Date; start: Date; end: Date }[]) {
    const byDay = new Map<string, typeof chunks>();
    for (const chunk of chunks) {
      const dayKey = format(chunk.day, "yyyy-MM-dd");
      if (!byDay.has(dayKey)) byDay.set(dayKey, []);
      byDay.get(dayKey)!.push(chunk);
    }

    const result = new Map<(typeof chunks)[number], number>();
    for (const [, dayChunks] of byDay.entries()) {
      dayChunks.sort((a, b) => a.start.getTime() - b.start.getTime());
      const active: { chunk: (typeof dayChunks)[number]; offset: number }[] = [];

      for (const chunk of dayChunks) {
        for (let i = active.length - 1; i >= 0; i--) {
          if (active[i].chunk.end <= chunk.start) active.splice(i, 1);
        }
        const usedOffsets = new Set(active.map((a) => a.offset));
        let offset = 0;
        while (usedOffsets.has(offset)) offset++;
        active.push({ chunk, offset });
        result.set(chunk, offset);
      }
    }
    return result;
  }

  const weekEvents = $derived.by(() => {
    const weekStart = startOfDay(days[0]);
    const weekEnd = endOfDay(days[6]);

    const filtered = events.filter((event) => {
      const isVisible = !($checkedCalendars[event.calendarId] === false);
      if (!isVisible) return false;

      const eventStart = toZonedTime(event.start, calendarTimezone);
      const eventEnd = toZonedTime(event.end, calendarTimezone);

      return (
        isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(eventEnd, { start: weekStart, end: weekEnd }) ||
        (eventStart < weekStart && eventEnd > weekEnd)
      );
    });

    const chunks = filtered.flatMap(splitEventByDay);
    const validChunks = chunks.filter(({ day }) => day >= weekStart && day <= weekEnd);
    const offsets = calculateOffsets(validChunks);

    return validChunks.map((chunk) => ({
      ...chunk,
      offset: offsets.get(chunk) ?? 0
    }));
  });

  let scrollContainer: HTMLDivElement;
</script>

<div class="flex flex-col h-full py-3">
  <div class="grid grid-cols-[50px_repeat(7,1fr)] text-xs sm:text-sm bg-base-200 sticky top-0 z-10">
    <div></div>
    {#each days as day (day)}
      <div
        class="min-h-8 flex flex-col border-b border-base-200 items-center justify-start relative px-1 py-1 gap-1"
      >
        <div class={`font-semibold text-center ${isToday(day) ? "text-secondary-content" : ""}`}>
          <p>
            {format(day, "EEE")}
            <span class="block sm:inline mb-2 sm:mb-0">{format(day, "d")}</span>
          </p>
        </div>
      </div>
    {/each}
  </div>

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden grid grid-cols-[50px_repeat(7,1fr)] rounded-2xl bg-base-100 relative"
  >
    {#each hours as hour (hour)}
      <div
        class="h-15 flex justify-center items-center select-none leading-none text-xs text-primary-content/70 border-r border-base-200"
      >
        {format(setHours(new Date(), hour), "h a")}
      </div>

      {#each days as day (day)}
        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format(day, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if hour === 0}
            <CurrentTimeIndicator {day} />
          {/if}

          {#each weekEvents as { event, day: eventDay, start, end, offset } (event.id)}
            {#if format(eventDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")}
              {#if start.getHours() === hour}
                <EventBlock
                  event={{
                    ...event,
                    start: start.toISOString(),
                    end: end.toISOString()
                  }}
                  {offset}
                />
              {/if}
            {/if}
          {/each}
        </div>
      {/each}
    {/each}
  </div>
</div>
