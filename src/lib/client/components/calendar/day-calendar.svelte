<script lang="ts">
  import { onMount } from "svelte";

  import { BirthdayCakeIcon, Flag02Icon } from "@hugeicons/core-free-icons";

  import { endOfDay, format, isToday, setHours, startOfDay } from "date-fns";

  import { userHolidayCountriesQuery } from "$lib/client/data/queries";
  import { currentDate } from "$lib/client/stores/change-date";
  import {
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/local-storage";
  import { birthdayModalStore, eventModalStore, holidayModalStore } from "$lib/client/stores/modal";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { getBirthdaysForDay, getVisibleBirthdays } from "../birthday/utils";
  import { EventBlock } from "../event";
  import { calculateEventOffsets, getEventDateObjects, getVisibleEvents } from "../event/utils";
  import { getHolidaysForDay, getVisibleHolidays } from "../holiday/utils";

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

<div class="flex h-full flex-col py-1">
  <div class="bg-base-200 border-base-200 sticky top-0 z-10 border-b">
    <div
      class={`text-center font-semibold ${isToday($currentDate) ? "text-primary-content" : "text-primary-content/70"}`}
    >
      <span class="flex items-center justify-center">
        {#if isToday($currentDate)}
          <span class="bg-primary-content mr-1 h-2 w-2 rounded-full"></span>
        {/if}

        {format($currentDate, "EEEE, MMM d")}
      </span>
    </div>
  </div>

  <div class="bg-base-200 border-base-200 grid grid-cols-[50px_1fr] border-b">
    <div></div>
    <div class="flex min-w-0 flex-col gap-1 pb-1">
      {#each getHolidaysForDay(visibleHolidays, $currentDate) as holiday (holiday.id)}
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

  <div
    bind:this={scrollContainer}
    class="bg-base-100 relative flex-1 overflow-x-hidden overflow-y-auto rounded-2xl"
  >
    <div class="relative grid grid-cols-[50px_1fr]">
      {#each hours as hour (hour)}
        <div
          class="text-primary-content/70 border-base-200 col-start-1 flex h-15 items-center justify-center border-r text-xs leading-none select-none"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>
        <div class="border-base-200 col-start-2 border-b"></div>
      {/each}

      <div class="pointer-events-none relative col-span-1 col-start-2 row-span-full row-start-1">
        <div class="pointer-events-auto absolute inset-0">
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
</div>
