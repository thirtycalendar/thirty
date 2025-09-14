<script lang="ts">
  import { onMount } from "svelte";

  import { BirthdayCakeIcon, Flag02Icon } from "@hugeicons/core-free-icons";

  import { addDays, endOfDay, format, isToday, setHours, startOfDay, startOfWeek } from "date-fns";

  import { userHolidayCountriesQuery } from "$lib/client/data/queries";
  import { currentDate } from "$lib/client/stores/change-date";
  import { birthdayModalStore, eventModalStore, holidayModalStore } from "$lib/client/stores/modal";
  import {
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/unchecked-store";
  import { cn } from "$lib/client/utils/cn";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { getBirthdaysForDay, getVisibleBirthdays } from "../birthday/utils";
  import { EventBlock } from "../event";
  import { calculateEventOffsets, getEventDateObjects, getVisibleEvents } from "../event/utils";
  import { getHolidaysForDay, getVisibleHolidays } from "../holiday/utils";
  import { calculateAllDayLayout } from "./utils";

  import { StickyBlock } from "..";
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

  const userHolidayCountries = $derived.by(() => {
    const data = userHolidayCountriesQuery().data;
    return data;
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

  let dragStartY: number | null = $state(null);
  let dragEndY: number | null = $state(null);
  let dragDay: Date | null = $state(null);

  const HOUR_HEIGHT = 60; // match your h-15 CSS (60px per hour)
  const INTERVAL = 15; // 15 minutes

  function snapToInterval(y: number) {
    const minutesPerPixel = 60 / HOUR_HEIGHT; // 1px = X minutes
    const totalMinutes = y * minutesPerPixel;
    const snappedMinutes = Math.floor(totalMinutes / INTERVAL) * INTERVAL;
    return snappedMinutes;
  }

  function onPointerDown(e: PointerEvent, day: Date) {
    dragStartY = e.offsetY;
    dragDay = day;
    dragEndY = dragStartY;
  }

  function onPointerMove(e: PointerEvent) {
    if (dragStartY !== null) {
      dragEndY = e.offsetY;
    }
  }

  function onPointerUp() {
    if (dragStartY !== null && dragEndY !== null && dragDay) {
      const startY = Math.min(dragStartY, dragEndY);
      const endY = Math.max(dragStartY, dragEndY);

      const startMinutes = snapToInterval(startY);
      const endMinutes = snapToInterval(endY);

      const startDate = new Date(dragDay);
      startDate.setHours(Math.floor(startMinutes / 60), startMinutes % 60);

      const endDate = new Date(dragDay);
      endDate.setHours(Math.floor(endMinutes / 60), endMinutes % 60);

      console.log("Start:", startDate);
      console.log("End:", endDate);
    }

    dragStartY = null;
    dragEndY = null;
    dragDay = null;
  }
</script>

<div class="flex h-full flex-col">
  <!-- Week header -->
  <div class="sticky top-0 z-20 grid grid-cols-[50px_repeat(7,1fr)] text-xs sm:text-sm">
    <div></div>
    {#each days as day (day.toISOString())}
      <div class="flex items-center justify-center">
        <span
          class={cn(
            "flex items-center gap-1",
            isToday(day) ? "text-primary-content" : "text-primary-content/70"
          )}
        >
          {#if isToday(day)}
            <span class="bg-primary-content h-2 w-2 rounded-full"></span>
          {/if}
          {format(day, "EEE")}
          {format(day, "d")}
        </span>
      </div>
    {/each}
  </div>

  <!-- All-day events -->
  <div class="border-base-200 grid grid-cols-[50px_repeat(7,1fr)] border-b pb-1">
    <div></div>
    {#each days as day, i (i + day.toISOString())}
      <div class="border-base-200 relative flex min-w-0 flex-col gap-1 border-r px-1">
        {#each getHolidaysForDay(visibleHolidays, day) as holiday (holiday.id)}
          <StickyBlock
            item={holiday}
            color={$userHolidayCountries?.find(
              (c) => c.id.toLocaleLowerCase() === holiday.countryId.toLocaleLowerCase()
            )?.color ?? "transparent"}
            title={holiday.name}
            onclick={(item) => {
              if ("countryCode" in item) {
                holidayModalStore.openModal(item);
              }
            }}
            icon={Flag02Icon}
          />
        {/each}

        {#each getBirthdaysForDay(visibleBirthdays, day) as birthday (birthday.id)}
          <StickyBlock
            item={birthday}
            color={birthday.color}
            title={birthday.name}
            onclick={(item) => {
              if ("dob" in item) {
                birthdayModalStore.openModal(item);
              }
            }}
            icon={BirthdayCakeIcon}
          />
        {/each}

        {#each allDayLayout.filter((e) => format(e.startDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")) as event (event.id)}
          <StickyBlock
            item={event}
            color={event.color}
            title={event.name}
            onclick={(item) => {
              if ("source" in item) {
                eventModalStore.openModal(item);
              }
            }}
          />
        {/each}
      </div>
    {/each}
  </div>

  <!-- Timed events -->
  <div
    bind:this={scrollContainer}
    class="bg-base-100 relative grid flex-1 grid-cols-[50px_repeat(7,1fr)] overflow-x-hidden overflow-y-auto"
  >
    <!-- Hours -->
    <div class="col-start-1 row-start-1 grid">
      {#each hours as hour (hour)}
        <div
          class="text-primary-content/70 border-base-200 flex h-15 items-center justify-center border-r text-center text-xs select-none"
        >
          <span class="relative">
            {format(setHours(new Date(), hour), "h a")}
          </span>
        </div>
      {/each}
    </div>

    <!-- Days -->
    {#each days as day, i (day.toISOString())}
      <div
        class="border-base-200 relative grid grid-rows-24 border-r"
        style="grid-column: {i + 2}; grid-row: 1;"
        onpointerdown={(e) => onPointerDown(e, day)}
        onpointermove={onPointerMove}
        onpointerup={onPointerUp}
      >
        {#each hours as hour (hour)}
          <div class="border-base-200 h-15 border-b"></div>
        {/each}

        {#if dragStartY !== null && dragDay?.toDateString() === day.toDateString()}
          <div
            class="bg-primary/70 border-primary-content/10 shaodw-md pointer-events-none absolute right-1 left-1 rounded-md border"
            style="
              top: {Math.min(dragStartY, dragEndY ?? dragStartY)}px;
              height: {Math.abs((dragEndY ?? dragStartY) - dragStartY)}px;
            "
          ></div>
        {/if}

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
