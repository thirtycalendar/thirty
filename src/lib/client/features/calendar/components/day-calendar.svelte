<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { derived } from "svelte/store";

  import {
    differenceInMinutes,
    endOfDay,
    format,
    isToday,
    isWithinInterval,
    parseISO,
    setHours,
    startOfDay
  } from "date-fns";

  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event } from "$lib/types";

  import { EventBlock } from "../../event/components";

  interface DayCalendarProps {
    events: Event[];
  }

  let { events }: DayCalendarProps = $props();

  let scrollContainer: HTMLDivElement;
  let now = new Date();
  let timer: ReturnType<typeof setInterval>;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayEvents = derived(
    [currentDate, checkedCalendars],
    ([$currentDate, $checkedCalendars]) => {
      const dayStart = startOfDay($currentDate);
      const dayEnd = endOfDay($currentDate);

      return events.filter((event) => {
        const calendarId = event.calendarId;
        const isVisible = !(calendarId in $checkedCalendars) || $checkedCalendars[calendarId];

        if (!isVisible) return false;

        const start = parseISO(event.start);
        const end = parseISO(event.end);
        return (
          isWithinInterval(start, { start: dayStart, end: dayEnd }) ||
          isWithinInterval(end, { start: dayStart, end: dayEnd })
        );
      });
    }
  );

  // const dayUtilEvents = derived(
  //   [currentDate, checkedCalendars],
  //   ([$currentDate, $checkedCalendars]) => {
  //     const dayStart = startOfDay($currentDate);
  //     const dayEnd = endOfDay($currentDate);

  //     return utilEvents.filter((event) => {
  //       const calendarId = event.calendarId;
  //       const isVisible = !(calendarId in $checkedCalendars) || $checkedCalendars[calendarId];

  //       if (!isVisible) return false;

  //       const normalizedDate = normalizeUtilEventDate(event.date.dateTime);
  //       return isWithinInterval(normalizedDate, { start: dayStart, end: dayEnd });
  //     });
  //   }
  // );

  const getLineOffset = () => {
    const minutes = differenceInMinutes(now, startOfDay(now));
    return (minutes / 60) * 60; // 60px per hour height
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
    }, 60 * 1000); // No need to scroll here, the red line position is reactive
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

      <!-- {#each $dayUtilEvents as util}
        <div
          class="text-primary text-[10px] py-[2px] px-[3px] mb-1 rounded-md truncate w-full"
          style="background-color: {getEventColor(util.calendarId)};"
          title={util.summary}
        >
          {util.summary}
        </div>
      {/each} -->
    </div>
  </div>

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto bg-base-100 relative rounded-2xl text-xs"
  >
    <div class="grid grid-cols-[50px_1fr]">
      {#each hours as hour}
        <div
          class="h-15 flex justify-center items-center select-none leading-none text-primary-content/70 border-r border-base-200"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>

        <div
          class="relative h-15 border border-base-200 hover:bg-base-300/10 transition-colors"
          data-day={format($currentDate, "yyyy-MM-dd")}
          data-hour={hour}
        >
          {#if isToday($currentDate) && hour === 0}
            <div
              class="z-10 absolute left-0 right-0 h-px bg-red-500"
              style="top: {getLineOffset()}px"
            ></div>
          {/if}

          {#each $dayEvents as event}
            {#if parseInt(format(parseISO(event.start), "H")) === hour}
              <EventBlock {event} />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
