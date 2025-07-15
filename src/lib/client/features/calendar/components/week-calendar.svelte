<script lang="ts">
  import { onMount } from "svelte";

  import { addDays, endOfDay, format, isToday, setHours, startOfDay, startOfWeek } from "date-fns";

  import {
    calculateEventOffsets,
    getEventDateObjects,
    getVisibleEvents
  } from "$lib/client/features/event/utils";
  import { currentDate } from "$lib/client/stores/change-date";
  import {
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/local-storage";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { BdBlock } from "../../birthday/components";
  import { getBirthdaysForDay, getVisibleBirthdays } from "../../birthday/utils";
  import { AllDayEventBlock, EventBlock } from "../../event/components";
  import { HdBlock } from "../../holiday/components"; // ADD THIS
  import { getHolidaysForDay, getVisibleHolidays } from "../../holiday/utils"; // ADD THIS

  import { calculateAllDayLayout } from "../utils";

  import { CurrentTimeIndicator } from ".";

  interface Props {
    events: Event[];
    birthdays: Birthday[] | null;
    holidays: Holiday[] | null;
  }

  let { events, birthdays, holidays }: Props = $props();

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

  const { store: uncheckedHds } = uncheckedHolidays;
  const visibleHolidays = $derived.by(() => getVisibleHolidays(holidays, $uncheckedHds));

  const { store: uncheckedBds } = uncheckedBirthdays;
  const visibleBirthdays = $derived.by(() => getVisibleBirthdays(birthdays, $uncheckedBds));

  const { store: unchecked } = uncheckedCalendars;
  const { allDayEvents, timedEvents } = $derived.by(() => {
    return getVisibleEvents(events, weekStart, weekEnd, $unchecked);
  });

  const allDayLayout = $derived.by(() => calculateAllDayLayout(allDayEvents, weekStart, weekEnd));

  const timedEventChunks = $derived.by(() => {
    const chunks = timedEvents.flatMap(splitEventByDay);
    const offsets = calculateEventOffsets(chunks);
    return chunks.map((chunk) => ({ ...chunk, offset: offsets.get(chunk) ?? 0 }));
  });

  let scrollContainer: HTMLDivElement;
  let now = new Date();

  function getLineOffset(date = now) {
    const hourOffset = 2;
    const minutes = (date.getHours() - hourOffset) * 60 + date.getMinutes();
    const clampedMinutes = Math.max(0, minutes);
    return (clampedMinutes / 60) * 60;
  }

  onMount(() => {
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTop = getLineOffset();
      }
    });
  });
</script>

<div class="flex flex-col h-full mt-2">
  <div class="grid grid-cols-[50px_repeat(7,1fr)] text-xs sm:text-sm bg-base-200 sticky top-0 z-20">
    <div class="border-r border-base-200"></div>
    {#each days as day (day.toISOString())}
      <div class="flex items-center justify-center border-b border-r border-base-200">
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

  <div class="grid grid-cols-[50px_repeat(7,1fr)] pb-1 bg-base-200 border-b border-base-200">
    <div></div>
    {#each days as day, i (i + day.toISOString())}
      <div class="relative border-r border-base-200 px-1 flex flex-col gap-1">
        {#each getBirthdaysForDay(visibleBirthdays, day) as bd (bd.id)}
          <BdBlock birthday={bd} />
        {/each}
        {#each getHolidaysForDay(visibleHolidays, day) as holiday (holiday.id)}
          <HdBlock {holiday} />
        {/each}
        {#each allDayLayout.filter((e) => format(e.startDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) as event (event.id)}
          <AllDayEventBlock {event} />
        {/each}
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
