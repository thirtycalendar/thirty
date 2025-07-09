<script lang="ts">
  import { endOfDay, format, isToday, isWithinInterval, setHours, startOfDay } from "date-fns";

  import { calculateEventOffsets, getEventDateObjects } from "$lib/client/features/event/utils";
  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";
  import { handleEventModal } from "$lib/client/stores/event";

  import type { Event } from "$lib/shared/types";

  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface DayCalendarProps {
    events: Event[];
  }
  let { events }: DayCalendarProps = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const allDayEvents = $derived.by(() =>
    events.filter(
      (event) =>
        event.allDay &&
        $checkedCalendars[event.calendarId] !== false &&
        isWithinInterval(getEventDateObjects(event).start, {
          start: startOfDay($currentDate),
          end: endOfDay($currentDate)
        })
    )
  );

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

    const offsets = calculateEventOffsets(chunks);
    return chunks.map((chunk) => ({
      ...chunk,
      offset: offsets.get(chunk) ?? 0
    }));
  });

  let scrollContainer: HTMLDivElement;
</script>

<div class="flex flex-col h-full py-3">
  <div class="bg-base-200 sticky top-0 z-10 border-b border-base-200 px-1 py-1">
    <div
      class={`font-semibold text-center ${isToday($currentDate) ? "text-primary-content" : "text-primary-content/70"}`}
    >
      {format($currentDate, "EEEE, MMM d")}
    </div>
  </div>

  {#if allDayEvents.length > 0}
    <div class="sticky top-[2.5rem] z-10 border-b border-base-200 bg-base-100">
      <div
        class="flex items-center gap-2 px-2 py-1 border-b border-base-200 text-xs text-primary-content/70"
      >
        <span>All Day</span>
      </div>
      <div class="px-2 py-1">
        {#each allDayEvents as event (event.id)}
          <button
            class="bg-primary/10 rounded px-2 py-1 text-xs truncate cursor-pointer mb-1 w-full text-left"
            title={event.name}
            onclick={() => handleEventModal(event)}
          >
            {event.name}
          </button>
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
</div>
