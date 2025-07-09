<script lang="ts">
  import {
    addDays,
    differenceInDays,
    endOfDay,
    format,
    isToday,
    isWithinInterval,
    max,
    min,
    setHours,
    startOfDay,
    startOfWeek
  } from "date-fns";

  import { calculateEventOffsets, getEventDateObjects } from "$lib/client/features/event/utils";
  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";
  import { handleEventModal } from "$lib/client/stores/event";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { AllDayLayoutInfo, Event } from "$lib/shared/types";

  import { EventBlock } from "../../event/components";
  import { getCalendars } from "../query";

  import { CurrentTimeIndicator } from ".";

  interface WeekCalendarProps {
    events: Event[];
  }

  let { events }: WeekCalendarProps = $props();

  const weekStart = $derived(startOfWeek($currentDate));
  const weekEnd = $derived(endOfDay(addDays(weekStart, 6)));
  const days = $derived(Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)));
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

  function calculateAllDayLayout(allDayEvents: Event[]): AllDayLayoutInfo[] {
    const sortedEvents = [...allDayEvents].sort((a, b) => {
      const startA = getEventDateObjects(a).start;
      const startB = getEventDateObjects(b).start;
      return startA.getTime() - startB.getTime();
    });

    const lanes: (string | null)[][] = [];
    const layout: AllDayLayoutInfo[] = [];

    for (const event of sortedEvents) {
      const { start, end } = getEventDateObjects(event);
      const eventStart = max([startOfDay(start), weekStart]);
      const eventEnd = min([startOfDay(end), weekEnd]);
      const startColumn = differenceInDays(eventStart, weekStart);
      const endColumn = differenceInDays(eventEnd, weekStart);

      let targetLane = 0;
      while (true) {
        if (!lanes[targetLane]) lanes[targetLane] = new Array(7).fill(null);
        const isOccupied = lanes[targetLane].slice(startColumn, endColumn + 1).some((c) => c);
        if (!isOccupied) break;
        targetLane++;
      }

      for (let i = startColumn; i <= endColumn; i++) lanes[targetLane][i] = event.id;

      layout.push({
        ...event,
        startColumn: startColumn + 1,
        span: endColumn - startColumn + 1,
        lane: targetLane
      });
    }
    return layout;
  }

  const { allDayEvents, timedEvents } = $derived.by(() => {
    const all: Event[] = [];
    const timed: Event[] = [];

    for (const event of events) {
      const isVisible = $checkedCalendars[event.calendarId] !== false;
      if (!isVisible) continue;

      const { start, end } = getEventDateObjects(event);
      const isInWeek =
        isWithinInterval(start, { start: weekStart, end: weekEnd }) ||
        isWithinInterval(end, { start: weekStart, end: weekEnd }) ||
        (start < weekStart && end > weekEnd);

      if (!isInWeek) continue;

      if (event.allDay) all.push(event);
      else timed.push(event);
    }
    return { allDayEvents: all, timedEvents: timed };
  });

  const allDayLayout = $derived(calculateAllDayLayout(allDayEvents));

  const timedEventChunks = $derived.by(() => {
    const chunks = timedEvents.flatMap(splitEventByDay);
    const offsets = calculateEventOffsets(chunks);
    return chunks.map((chunk) => ({ ...chunk, offset: offsets.get(chunk) ?? 0 }));
  });

  const { data: calendars } = getCalendars();

  let scrollContainer: HTMLDivElement;
</script>

<div class="flex flex-col h-full py-3">
  <div class="grid grid-cols-[50px_repeat(7,1fr)] text-xs sm:text-sm bg-base-200 sticky top-0 z-20">
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

  {#if allDayLayout.length > 0}
    <div class="grid grid-cols-[50px_repeat(7,1fr)] bg-base-200 border-b border-base-200">
      <div></div>
      <div class="col-start-2 col-span-7 relative grid grid-cols-7 border-r border-base-200">
        {#each allDayLayout as event (event.id)}
          {@const eventColor = getColorHexCodeFromId(event.colorId)}
          {@const calendar = $calendars?.find((c) => c.id === event.calendarId)}
          {@const calendarColor = getColorHexCodeFromId(calendar?.colorId ?? "-1")}
          <button
            class="text-primary-content w-full cursor-pointer rounded-md flex items-center gap-1.5 backdrop-blur-md border border-primary-content/10 shadow-sm p-0 text-left h-[26px]"
            style:background-color="{eventColor}33"
            title={event.name}
            onclick={() => handleEventModal(event)}
          >
            <div
              class="w-1 h-full rounded-l-md shrink-0"
              style:background-color={calendarColor}
            ></div>
            <div class="px-1 py-0.5 overflow-hidden">
              <p class="text-xs font-semibold text-primary-content/90 truncate">{event.name}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden grid grid-cols-[50px_repeat(7,1fr)] rounded-b-2xl bg-base-100 relative"
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
          {#each timedEventChunks.filter((e) => format(e.day, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) as { event, start, end, offset } (event.id + start.toISOString())}
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
