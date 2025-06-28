<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { derived } from "svelte/store";

  import {
    addDays,
    differenceInMinutes,
    endOfDay,
    format,
    isToday,
    isWithinInterval,
    startOfDay
  } from "date-fns";
  import { toZonedTime } from "date-fns-tz";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event } from "$lib/types";

  import { EventBlock } from "../../event/components";

  interface WeekCalendarProps {
    events: Event[];
  }

  let { events }: WeekCalendarProps = $props();

  let scrollContainer: HTMLDivElement;
  let now = new Date();
  let timer: ReturnType<typeof setInterval>;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const calendarTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function splitEventByDay(
    event: Event,
    dayStart: Date
  ): { event: Event; start: Date; end: Date }[] {
    const chunks = [];
    const eventStartTz = toZonedTime(event.start, calendarTimezone);
    const eventEndTz = toZonedTime(event.end, calendarTimezone);

    const dayEnd = endOfDay(dayStart);

    const start = eventStartTz < dayStart ? dayStart : eventStartTz;
    const end = eventEndTz > dayEnd ? dayEnd : eventEndTz;

    chunks.push({ event, start, end });
    return chunks;
  }

  const dayEvents = derived(
    [currentDate, checkedCalendars],
    ([$currentDate, $checkedCalendars]) => {
      const dayStart = startOfDay($currentDate);
      const dayEnd = endOfDay($currentDate);

      const filtered = events.filter((event) => {
        const calendarId = event.calendarId;
        const isVisible = !(calendarId in $checkedCalendars) || $checkedCalendars[calendarId];
        if (!isVisible) return false;

        const eventStartTz = toZonedTime(event.start, calendarTimezone);
        const eventEndTz = toZonedTime(event.end, calendarTimezone);

        return (
          isWithinInterval(eventStartTz, { start: dayStart, end: dayEnd }) ||
          isWithinInterval(eventEndTz, { start: dayStart, end: dayEnd }) ||
          (eventStartTz < dayStart && eventEndTz > dayEnd)
        );
      });

      const chunks = filtered.flatMap((event) => splitEventByDay(event, dayStart));

      chunks.sort((a, b) => a.start.getTime() - b.start.getTime());

      return chunks;
    }
  );

  const getLineOffset = () => {
    const minutes = differenceInMinutes(now, startOfDay(now));
    return (minutes / 60) * 60;
  };

  async function scrollToCurrentTime() {
    await tick();
    if (scrollContainer) {
      scrollContainer.scrollTop = getLineOffset();
    }
  }

  currentDate.subscribe((value) => {
    if (isToday(value)) {
      now = new Date();
      scrollToCurrentTime();
    }
  });

  onMount(() => {
    if (isToday($currentDate)) scrollToCurrentTime();

    timer = setInterval(() => {
      now = new Date();
    }, 60 * 1000);
  });

  onDestroy(() => {
    clearInterval(timer);
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

  <div bind:this={scrollContainer} class="flex-1 overflow-y-auto bg-base-100 relative rounded-2xl">
    <div class="grid grid-cols-[50px_1fr]">
      {#each hours as hour}
        <div
          class="h-15 flex justify-center items-center select-none leading-none text-xs text-primary-content/70 border-r border-base-200"
        >
          {format(new Date().setHours(hour, 0, 0, 0), "h a")}
        </div>

        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format($currentDate, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if isToday($currentDate) && hour === 0}
            <div
              class="z-20 absolute left-0 right-0 flex items-center"
              style={`top: ${getLineOffset()}px`}
            >
              <div class="w-[8px] h-[8px] bg-primary-content rounded-full ml-[1px]"></div>
              <div class="h-[1px] bg-primary-content flex-1"></div>
            </div>
          {/if}

          {#each $dayEvents as { event, start }}
            {#if start.getHours() === hour}
              <EventBlock event={{ ...event, start: start.toISOString() }} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
