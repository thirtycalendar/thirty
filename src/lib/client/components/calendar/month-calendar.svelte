<script lang="ts">
  import { BirthdayCakeIcon, Flag02Icon } from "@hugeicons/core-free-icons";

  import {
    addDays,
    differenceInCalendarWeeks,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfDay,
    startOfMonth,
    startOfWeek
  } from "date-fns";

  import { userHolidayCountriesQuery } from "$lib/client/data/queries";
  import { setDayView } from "$lib/client/stores/calendar-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import {
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/checked-items";
  import { birthdayModalStore, eventModalStore, holidayModalStore } from "$lib/client/stores/modal";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { getBirthdaysForDay, getVisibleBirthdays } from "../birthday/utils";
  import { getEventDateObjects } from "../event/utils";
  import { getHolidaysForDay, getVisibleHolidays } from "../holiday/utils";

  import { StickyBlock } from "..";

  interface Props {
    events: Event[];
    birthdays: Birthday[] | null;
    holidays: Holiday[] | null;
  }

  let { events, birthdays, holidays }: Props = $props();

  const MAX_BLOCKS = 3;

  const monthInfo = $derived.by(() => {
    const monthStart = startOfMonth($currentDate);
    const viewStart = startOfWeek(monthStart);
    const viewEnd = endOfWeek(endOfMonth($currentDate));
    const weekCount = differenceInCalendarWeeks(viewEnd, viewStart, { weekStartsOn: 0 }) + 1;
    const days = Array.from({ length: weekCount * 7 }, (_, i) => addDays(viewStart, i));
    return { days, viewStart, viewEnd, weekCount };
  });

  const { store: uncheckedHds } = uncheckedHolidays;
  const visibleHolidays = $derived.by(() => getVisibleHolidays(holidays, $uncheckedHds));
  const userHolidayCountries = $derived.by(() => userHolidayCountriesQuery().data);

  const { store: uncheckedBds } = uncheckedBirthdays;
  const visibleBirthdays = $derived.by(() => getVisibleBirthdays(birthdays, $uncheckedBds));

  const { store: unchecked } = uncheckedCalendars;
  const eventsByDay = $derived.by(() => {
    const { viewStart, viewEnd } = monthInfo;
    const map: Record<string, Event[]> = {};

    for (const event of events) {
      const isNotVisible = $unchecked.includes(event.calendarId);
      if (isNotVisible) continue;

      const { start: eventStart, end: eventEnd } = getEventDateObjects(event);
      if (eventStart > viewEnd || eventEnd < viewStart) continue;

      let cursor = startOfDay(eventStart < viewStart ? viewStart : eventStart);

      while (cursor < eventEnd && cursor <= viewEnd) {
        const key = format(cursor, "yyyy-MM-dd");
        if (!map[key]) map[key] = [];
        map[key].push(event);
        cursor = addDays(cursor, 1);
      }
    }

    for (const key in map) {
      map[key].sort((a, b) => {
        const { start: startA } = getEventDateObjects(a);
        const { start: startB } = getEventDateObjects(b);
        if (a.allDay && !b.allDay) return -1;
        if (!a.allDay && b.allDay) return 1;
        return startA.getTime() - startB.getTime();
      });
    }
    return map;
  });
</script>

<div class="flex h-full flex-col">
  <!-- Header -->
  <div
    class="bg-base-100 border-base-200 sticky top-0 z-20 grid grid-cols-7 border-b pb-1 text-xs sm:text-sm"
  >
    {#each [...Array(7).keys()] as i (i)}
      {@const day = addDays(startOfWeek(new Date()), i)}
      <div class="flex items-center justify-center">
        <span
          class={`flex items-center gap-1 ${isToday(day) ? "text-primary-content" : "text-primary-content/70"}`}
        >
          {#if isToday(day)}
            <span class="bg-primary-content h-2 w-2 rounded-full"></span>
          {/if}
          {format(day, "EEE")}
        </span>
      </div>
    {/each}
  </div>

  <!-- Month Grid -->
  <div
    class="bg-base-100 border-base-200 grid flex-1 grid-cols-7 border-l"
    style="grid-template-rows: repeat({monthInfo.weekCount}, minmax(0, 1fr))"
  >
    {#each monthInfo.days as day (day.toISOString())}
      {@const key = format(day, "yyyy-MM-dd")}
      {@const dayEvents = eventsByDay[key] || []}
      {@const holidaysForDay = getHolidaysForDay(visibleHolidays, day)}
      {@const birthdaysForDay = getBirthdaysForDay(visibleBirthdays, day)}

      {@const blocks = [
        ...holidaysForDay.map((holiday) => ({
          type: "holiday" as const,
          id: holiday.id,
          title: holiday.name,
          color:
            $userHolidayCountries?.find(
              (c) => c.id.toLocaleLowerCase() === holiday.countryId.toLocaleLowerCase()
            )?.color ?? "transparent",
          icon: Flag02Icon,
          item: holiday
        })),
        ...birthdaysForDay.map((birthday) => ({
          type: "birthday" as const,
          id: birthday.id,
          title: birthday.name,
          color: birthday.color,
          icon: BirthdayCakeIcon,
          item: birthday
        })),
        ...dayEvents.map((event) => ({
          type: "event" as const,
          id: event.id,
          title: event.name,
          color: event.color,
          icon: undefined,
          item: event
        }))
      ]}

      {@const visibleBlocks = blocks.slice(0, MAX_BLOCKS)}
      {@const hiddenCount = blocks.length - visibleBlocks.length}

      <button
        class="border-base-200 relative flex min-w-0 flex-col gap-1 overflow-hidden border-r border-b px-1 py-1"
        class:opacity-40={!isSameMonth(day, $currentDate)}
        onclick={() => {
          currentDate.set(day);
          setDayView();
        }}
      >
        <div class="mb-1 self-end text-xs font-medium">
          <span
            class="grid h-5 w-5 place-content-center rounded-md"
            class:bg-accent={isToday(day)}
            class:text-accent-content={isToday(day)}
            class:text-base-content={!isToday(day) && isSameMonth(day, $currentDate)}
          >
            {format(day, "d")}
          </span>
        </div>

        <!-- Visible Blocks -->
        {#each visibleBlocks as block (block.type + block.id)}
          <StickyBlock
            item={block.item}
            color={block.color}
            title={block.title}
            onclick={(item) => {
              if (block.type === "holiday") holidayModalStore.openModal(item as Holiday);
              if (block.type === "birthday") birthdayModalStore.openModal(item as Birthday);
              if (block.type === "event") eventModalStore.openModal(item as Event);
            }}
            icon={block.icon}
          />
        {/each}

        <!-- +X more indicator -->
        {#if hiddenCount > 0}
          <div class="text-base-content/80 pt-0.5 text-xs font-semibold">
            +{hiddenCount} more
          </div>
        {/if}
      </button>
    {/each}
  </div>
</div>
