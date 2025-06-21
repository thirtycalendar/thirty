<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { derived } from "svelte/store";

  import {
    addDays,
    endOfDay,
    format,
    isToday,
    isWithinInterval,
    parseISO,
    setHours,
    startOfDay,
    startOfWeek
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

  const calendarTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek($currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  function splitEventByDay(event: Event): { event: Event; day: Date; start: Date; end: Date }[] {
    const chunks = [];

    const eventStartTz = toZonedTime(event.start, calendarTimezone);
    const eventEndTz = toZonedTime(event.end, calendarTimezone);

    let currentStart = eventStartTz;

    while (currentStart < eventEndTz) {
      const dayStart = startOfDay(currentStart);
      const dayEnd = endOfDay(currentStart);

      const chunkEnd = eventEndTz < dayEnd ? eventEndTz : dayEnd;

      chunks.push({
        event,
        day: dayStart,
        start: currentStart,
        end: chunkEnd
      });

      currentStart = addDays(dayStart, 1);
    }

    return chunks;
  }

  const weekEvents = derived([days, checkedCalendars], ([$days, $checkedCalendars]) => {
    const weekStart = startOfDay($days[0]);
    const weekEnd = endOfDay($days[6]);

    const filtered = events.filter((event) => {
      const calendarId = event.calendarId;
      const isVisible = !(calendarId in $checkedCalendars) || $checkedCalendars[calendarId];
      if (!isVisible) return false;

      const eventStart = toZonedTime(event.start, calendarTimezone);
      const eventEnd = toZonedTime(event.end, calendarTimezone);

      return (
        isWithinInterval(eventStart, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(eventEnd, { start: weekStart, end: weekEnd }) ||
        (eventStart < weekStart && eventEnd > weekEnd)
      );
    });

    // Split each filtered event into daily chunks
    const chunks = filtered.flatMap(splitEventByDay);

    // Only keep chunks that fall within the displayed week days
    return chunks.filter(({ day }) => {
      return day >= weekStart && day <= weekEnd;
    });
  });

  let now = new Date();
  let timer: ReturnType<typeof setInterval>;
  let scrollContainer: HTMLDivElement;

  onMount(() => {
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop = getLineOffset();
      }
    });

    timer = setInterval(() => {
      now = new Date();
    }, 60 * 1000);
  });

  onDestroy(() => clearInterval(timer));

  const getLineOffset = () => {
    const minutes = now.getHours() * 60 + now.getMinutes();
    return (minutes / 60) * 60; // 60px = 1 hour
  };

  const getDayString = (date: Date) => format(date, "yyyy-MM-dd");
</script>

<div class="flex flex-col h-full py-3">
  <!-- Day Headers -->
  <div class="grid grid-cols-[50px_repeat(7,1fr)] text-xs sm:text-sm bg-base-200 sticky top-0 z-10">
    <div></div>
    {#each $days as day}
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

  <!-- Time Grid -->
  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto grid grid-cols-[50px_repeat(7,1fr)] text-xs rounded-2xl bg-base-100 relative"
  >
    {#each hours as hour}
      <!-- Time Labels -->
      <div
        class="h-15 flex justify-center items-center select-none leading-none text-primary-content/70 border-r border-base-200"
      >
        {format(setHours(new Date(), hour), "h a")}
      </div>

      {#each $days as day}
        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format(day, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if isToday(day) && hour === 0}
            <div
              class="z-10 absolute left-0 right-0 h-px bg-red-500"
              style={`top: ${getLineOffset()}px`}
            ></div>
          {/if}

          {#each $weekEvents as { event, day: eventDay, start, end }}
            {#if format(eventDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")}
              {#if start.getHours() === hour}
                <EventBlock
                  event={{
                    ...event,
                    start: start.toISOString(),
                    end: end.toISOString()
                  }}
                />
              {/if}
            {/if}
          {/each}
        </div>
      {/each}
    {/each}
  </div>
</div>
