<script lang="ts">
  import { Cake, Flag } from "@lucide/svelte"; // ADD Flag ICON

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

  import { getEventDateObjects } from "$lib/client/features/event/utils";
  import { changeToDayView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import {
    uncheckedBirthdays,
    uncheckedCalendars,
    uncheckedHolidays
  } from "$lib/client/stores/local-storage";

  import type { Birthday, Event, Holiday } from "$lib/shared/types";

  import { getBirthdaysForDay, getVisibleBirthdays } from "../../birthday/utils";
  import { getHolidayCountries } from "../../holiday/query";
  import { getHolidaysForDay, getVisibleHolidays } from "../../holiday/utils";

  interface Props {
    events: Event[];
    birthdays: Birthday[] | null;
    holidays: Holiday[] | null;
  }

  let { events, birthdays, holidays }: Props = $props();

  const MAX_EVENTS_PER_DAY = 3;
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDayString = (date: Date) => format(date, "yyyy-MM-dd");

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
  const { data: hdCountries } = getHolidayCountries();

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
        const key = getDayString(cursor);
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

<div class="flex h-full flex-col py-1">
  <div class="bg-base-200 sticky top-0 z-10 grid grid-cols-7 text-sm">
    {#each dayLabels as label, i (label)}
      {@const today = i === new Date().getDay()}
      <div
        class={`relative flex h-8 items-center justify-center font-semibold ${today ? "text-primary-content" : "text-primary-content/70"}`}
      >
        {#if today}
          <span class="bg-primary-content mr-1 h-2 w-2 rounded-full"></span>
        {/if}
        {label}
      </div>
    {/each}
  </div>

  <div
    class="bg-base-100 border-base-200 grid flex-1 grid-cols-7 rounded-2xl border-t border-l"
    style="grid-template-rows: repeat({monthInfo.weekCount}, minmax(0, 1fr))"
  >
    {#each monthInfo.days as day (day.toISOString())}
      {@const key = getDayString(day)}
      {@const dayEvents = eventsByDay[key] || []}
      <button
        class="border-base-200 hover:bg-base-300/10 relative flex flex-col items-start border-r border-b px-1 py-1 text-left transition-colors"
        onclick={() => {
          currentDate.set(day);
          changeToDayView();
        }}
      >
        <div class="mb-1 self-end text-xs font-medium">
          <span
            class="grid h-5 w-5 place-content-center rounded-md"
            class:bg-accent={isToday(day)}
            class:text-accent-content={isToday(day)}
            class:text-base-content={!isToday(day) && isSameMonth(day, $currentDate)}
            class:opacity-40={!isSameMonth(day, $currentDate)}
          >
            {format(day, "d")}
          </span>
        </div>

        <div class="w-full flex-1 space-y-1 overflow-hidden text-[10px] leading-tight">
          {#each getHolidaysForDay(visibleHolidays, day) as holiday (holiday.id)}
            {@const match = $hdCountries?.filter((hdCountry) => hdCountry.id === holiday.countryId)}
            {@const color = match ? match[0].color : "transparent"}
            <div
              class="truncate rounded-full px-1.5 py-0.5 font-medium shadow-sm backdrop-blur-sm"
              style={`background-color: ${color}22; color: ${color};`}
              title={holiday.name}
            >
              <div class="flex items-center gap-1">
                <Flag size="12" strokeWidth="2.5" class="flex-shrink-0" />
                <p class="truncate">{holiday.name}</p>
              </div>
            </div>
          {/each}

          {#each getBirthdaysForDay(visibleBirthdays, day) as bd (bd.id)}
            {@const hasBirthdaySuffix = /birthday$/i.test(bd.name.trim())}
            {@const name = hasBirthdaySuffix ? bd.name : `${bd.name}'s birthday`}
            {@const color = bd.color}

            <div
              class="truncate rounded-full px-1.5 py-0.5 font-medium shadow-sm backdrop-blur-sm"
              style={`background-color: ${color}22; color: ${color};`}
              title={`${name}'s birthday`}
            >
              <div class="flex items-center gap-1">
                <Cake size="12" strokeWidth="2.5" class="flex-shrink-0" />
                <p class="truncate">{name}</p>
              </div>
            </div>
          {/each}

          {#each dayEvents.slice(0, MAX_EVENTS_PER_DAY) as event (event.id)}
            {@const color = event.color}
            <div
              class="truncate rounded-full px-1.5 py-0.5 font-medium shadow-sm backdrop-blur-sm"
              style={`background-color: ${color}22; color: ${color};`}
              title={event.name}
            >
              {event.name}
            </div>
          {/each}

          {#if dayEvents.length > MAX_EVENTS_PER_DAY}
            <div class="text-base-content/80 pt-0.5 font-bold">
              + {dayEvents.length - MAX_EVENTS_PER_DAY} more
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
