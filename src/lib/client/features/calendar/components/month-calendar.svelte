<script lang="ts">
  import { Cake } from "@lucide/svelte";

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
  import { uncheckedBirthdays, uncheckedCalendars } from "$lib/client/stores/local-storage";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Birthday, Event } from "$lib/shared/types";

  import { getBirthdaysForDay, getVisibleBirthdays } from "../../birthday/utils";

  interface Props {
    events: Event[];
    birthdays: Birthday[];
  }

  let { events, birthdays }: Props = $props();

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
        if (a.allDay && !b.allDay) return -1; // all-day events first
        if (!a.allDay && b.allDay) return 1;
        return startA.getTime() - startB.getTime();
      });
    }
    return map;
  });
</script>

<div class="flex flex-col h-full py-3">
  <div class="grid grid-cols-7 bg-base-200 text-sm sticky top-0 z-10">
    {#each dayLabels as label (label)}
      <div class="h-8 flex items-center justify-center font-semibold">{label}</div>
    {/each}
  </div>

  <div
    class="grid flex-1 grid-cols-7 bg-base-100 rounded-2xl border-l border-t border-base-200"
    style="grid-template-rows: repeat({monthInfo.weekCount}, minmax(0, 1fr))"
  >
    {#each monthInfo.days as day (day.toISOString())}
      {@const key = getDayString(day)}
      {@const dayEvents = eventsByDay[key] || []}
      <button
        class="border-b border-r border-base-200 px-1 py-1 text-left relative hover:bg-base-300/10 transition-colors flex flex-col items-start"
        onclick={() => {
          currentDate.set(day);
          changeToDayView();
        }}
      >
        <div class="self-end text-xs font-medium mb-1">
          <span
            class="grid place-content-center h-5 w-5 rounded-md"
            class:bg-accent={isToday(day)}
            class:text-accent-content={isToday(day)}
            class:text-base-content={!isToday(day) && isSameMonth(day, $currentDate)}
            class:opacity-40={!isSameMonth(day, $currentDate)}
          >
            {format(day, "d")}
          </span>
        </div>
        <div class="w-full flex-1 space-y-1 text-[10px] leading-tight overflow-hidden">
          {#each getBirthdaysForDay(visibleBirthdays, day) as bd (bd.id)}
            {@const hasBirthdaySuffix = /birthday$/i.test(bd.name.trim())}
            {@const name = hasBirthdaySuffix ? bd.name : `${bd.name}'s birthday`}
            {@const color = getColorHexCodeFromId(bd.colorId)}

            <div
              class="truncate px-1.5 py-0.5 font-medium rounded-full shadow-sm backdrop-blur-sm"
              style={`background-color: ${color}22; color: ${color};`}
              title={`${name}'s birthday`}
            >
              <div class="flex items-center gap-1">
                <Cake size="12" strokeWidth="2.5" />
                <p class="truncate">{name}</p>
              </div>
            </div>
          {/each}

          {#each dayEvents.slice(0, MAX_EVENTS_PER_DAY) as event (event.id)}
            {@const color = getColorHexCodeFromId(event.colorId)}
            <div
              class="truncate px-1.5 py-0.5 font-medium rounded-full shadow-sm backdrop-blur-sm"
              style={`background-color: ${color}22; color: ${color};`}
              title={event.name}
            >
              {event.name}
            </div>
          {/each}
          {#if dayEvents.length > MAX_EVENTS_PER_DAY}
            <div class="font-bold text-base-content/80 pt-0.5">
              + {dayEvents.length - MAX_EVENTS_PER_DAY} more
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
