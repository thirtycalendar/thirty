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
    startOfWeek
  } from "date-fns";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event, UtilEvent } from "$lib/types";

  import { EventBlock } from "../event";

  interface WeekCalendarProps {
    events: Event[];
    utilEvents: UtilEvent[];
  }

  let { events, utilEvents }: WeekCalendarProps = $props();

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek($currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const weekEvents = derived([days, checkedCalendars], ([$days, $checkedCalendars]) => {
    const weekStart = $days[0];
    const weekEnd = endOfDay($days[6]);

    return events.filter((event) => {
      const calendarId = event.calendarId;
      const isVisible = !(calendarId in $checkedCalendars) || $checkedCalendars[calendarId];

      if (!isVisible) return false;

      const start = parseISO(event.start.dateTime);
      const end = parseISO(event.end.dateTime);
      return (
        isWithinInterval(start, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(end, { start: weekStart, end: weekEnd })
      );
    });
  });

  const weekUtilEvents = derived([days, checkedCalendars], ([$days, $checkedCalendars]) => {
    const weekStart = $days[0];
    const weekEnd = endOfDay($days[6]);

    return utilEvents.filter((event) => {
      const calendarId = event.calendarId;
      const isVisible = !(calendarId in $checkedCalendars) || $checkedCalendars[calendarId];

      if (!isVisible) return false;

      const normalizedDate = normalizeUtilEventDate(event.date.dateTime);
      return isWithinInterval(normalizedDate, { start: weekStart, end: weekEnd });
    });
  });

  function normalizeUtilEventDate(dateStr: string) {
    const parsed = parseISO(dateStr);
    if (isNaN(parsed.getTime())) {
      console.warn("Invalid utilEvent date:", dateStr);
    }
    return parsed;
  }

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
        <!-- Day Label -->
        <div class={`font-semibold text-center ${isToday(day) ? "text-secondary-content" : ""}`}>
          <p>
            {format(day, "EEE")}
            <span class="block sm:inline mb-2 sm:mb-0">{format(day, "d")}</span>
          </p>
        </div>

        <!-- Util Events -->
        {#each $weekUtilEvents.filter((e) => format(normalizeUtilEventDate(e.date.dateTime), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) as util}
          <div
            class="text-primary text-[10px] py-[2px] px-[3px] rounded-md truncate max-w-full"
            style="background-color: {util.bgColor || '#e5e7eb'};"
            title={util.summary}
          >
            {util.summary}
          </div>
        {/each}
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

          {#each $weekEvents as event}
            {#if getDayString(parseISO(event.start.dateTime)) === format(day, "yyyy-MM-dd")}
              {#if parseInt(format(parseISO(event.start.dateTime), "H")) === hour}
                <EventBlock {event} />
              {/if}
            {/if}
          {/each}
        </div>
      {/each}
    {/each}
  </div>
</div>
