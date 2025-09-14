<script lang="ts">
  import { onMount, tick } from "svelte";

  import { BirthdayCakeIcon, Flag02Icon } from "@hugeicons/core-free-icons";

  import { endOfDay, format, isToday, setHours, startOfDay } from "date-fns";

  import { userHolidayCountriesQuery } from "$lib/client/data/queries";
  import { currentDate } from "$lib/client/stores/change-date";
  import { birthdayModalStore, eventModalStore, holidayModalStore } from "$lib/client/stores/modal";
  import {
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/unchecked-store";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { getBirthdaysForDay, getVisibleBirthdays } from "../birthday/utils";
  import { EventBlock } from "../event";
  import {
    calculateEventOffsets,
    draggedEventEnd,
    draggedEventStart,
    getEventDateObjects,
    getVisibleEvents
  } from "../event/utils";
  import { getHolidaysForDay, getVisibleHolidays } from "../holiday/utils";
  import { createDragCreate } from "./utils";

  import { StickyBlock } from "..";
  import { CurrentTimeIndicator } from ".";

  interface Props {
    events: Event[];
    birthdays: Birthday[] | null;
    holidays: Holiday[] | null;
  }

  let { events, birthdays, holidays }: Props = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayStart = $derived(startOfDay($currentDate));
  const dayEnd = $derived(endOfDay($currentDate));

  const { store: uncheckedHds } = uncheckedHolidays;
  const visibleHolidays = $derived.by(() => getVisibleHolidays(holidays, $uncheckedHds));

  const { store: uncheckedBds } = uncheckedBirthdays;
  const visibleBirthdays = $derived.by(() => getVisibleBirthdays(birthdays, $uncheckedBds));

  const { store: unchecked } = uncheckedCalendars;
  const { allDayEvents, timedEvents } = $derived.by(() => {
    return getVisibleEvents(events, dayStart, dayEnd, $unchecked);
  });

  const userHolidayCountries = $derived.by(() => {
    const data = userHolidayCountriesQuery().data;
    return data;
  });

  const timedEventChunks = $derived.by(() => {
    const chunks = timedEvents.map((event) => {
      const { start, end } = getEventDateObjects(event);
      return {
        event,
        start: start < dayStart ? dayStart : start,
        end: end > dayEnd ? dayEnd : end
      };
    });
    const offsets = calculateEventOffsets(chunks);
    return chunks.map((chunk) => ({ ...chunk, offset: offsets.get(chunk) ?? 0 }));
  });

  // Scroll to current time
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
      if (scrollContainer) scrollContainer.scrollTop = getLineOffset();
    });
  });

  const { state: dragState, onPointerDown, onPointerMove, onPointerUp } = createDragCreate(60, 15);

  async function handleNewEvent(start: Date, end: Date) {
    draggedEventStart.set(start);
    draggedEventEnd.set(end);

    await tick();
    eventModalStore.toggleModal();
  }
</script>

<div class="flex h-full flex-col">
  <!-- Header -->
  <div class="sticky top-0 z-20 grid grid-cols-[50px_1fr] text-xs sm:text-sm">
    <div></div>
    <div class="flex items-center justify-center">
      <span
        class={`flex items-center gap-1 ${isToday($currentDate) ? "text-primary-content" : "text-primary-content/70"}`}
      >
        {#if isToday($currentDate)}
          <span class="bg-primary-content h-2 w-2 rounded-full"></span>
        {/if}
        {format($currentDate, "EEEE, MMM d")}
      </span>
    </div>
  </div>

  <!-- All-day row -->
  <div class="border-base-200 grid grid-cols-[50px_1fr] border-b pb-1">
    <div></div>
    <div class="relative flex min-w-0 flex-col gap-1 px-1">
      {#each getHolidaysForDay(visibleHolidays, $currentDate) as holiday (holiday.id)}
        <StickyBlock
          item={holiday}
          color={$userHolidayCountries?.find(
            (c) => c.id.toLowerCase() === holiday.countryId.toLowerCase()
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

      {#each getBirthdaysForDay(visibleBirthdays, $currentDate) as birthday (birthday.id)}
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

      {#each allDayEvents as event (event.id)}
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
  </div>

  <!-- Timed grid -->
  <div
    bind:this={scrollContainer}
    class="bg-base-100 relative grid flex-1 grid-cols-[50px_1fr] overflow-x-hidden overflow-y-auto"
  >
    <!-- Hours -->
    <div class="col-start-1 row-start-1 grid">
      {#each hours as hour (hour)}
        <div
          class="text-primary-content/70 border-base-200 flex h-15 items-center justify-center border-r text-xs select-none"
        >
          <span>{format(setHours(new Date(), hour), "h a")}</span>
        </div>
      {/each}
    </div>

    <!-- Day column -->
    <div
      class="border-base-200 relative grid grid-rows-24 border-r"
      style="grid-column: 2; grid-row: 1;"
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={() => onPointerUp(handleNewEvent, $currentDate)}
    >
      {#each hours as hour (hour)}
        <div class="border-base-200 h-15 border-b"></div>
      {/each}

      <!-- Drag selection overlay -->
      {#if $dragState.startY !== null}
        <div
          class="dragged-event-placeholder"
          style="top: {Math.min(
            $dragState.startY,
            $dragState.endY ?? $dragState.startY
          )}px; height: {Math.abs(($dragState.endY ?? $dragState.startY) - $dragState.startY)}px;"
        ></div>
      {/if}
      <!-- Events -->
      <div class="absolute inset-0">
        {#each timedEventChunks as { event, start, end, offset } (event.id)}
          <EventBlock {event} {start} {end} {offset} />
        {/each}

        {#if isToday($currentDate)}
          <CurrentTimeIndicator day={$currentDate} />
        {/if}
      </div>
    </div>
  </div>
</div>
