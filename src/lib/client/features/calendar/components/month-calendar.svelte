<script lang="ts">
  import { derived } from "svelte/store";

  import {
    addDays,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    isWithinInterval,
    parseISO,
    startOfMonth,
    startOfWeek
  } from "date-fns";

  import { changeToDayView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event } from "$lib/types";
  import { getColorHexCodeFromId } from "$lib/utils/colors";

  interface MonthCalendarProps {
    events: Event[];
  }

  let { events }: MonthCalendarProps = $props();

  const MAX_EVENTS_PER_DAY = 4;

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek(startOfMonth($currentDate));
    const end = endOfWeek(endOfMonth($currentDate));
    return Array.from(
      { length: Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1 },
      (_, i) => addDays(start, i)
    );
  });

  const getDayString = (date: Date) => format(date, "yyyy-MM-dd");

  const eventsByDay = derived([days, checkedCalendars], ([$days, $checkedCalendars]) => {
    const start = $days[0];
    const end = endOfDay($days[$days.length - 1]);

    const tempMap: Record<string, { normals: Event[] }> = {};

    for (const event of events) {
      const isVisible =
        !(event.calendarId in $checkedCalendars) || $checkedCalendars[event.calendarId];
      if (!isVisible) continue;

      const startDate = parseISO(event.start);
      if (isWithinInterval(startDate, { start, end })) {
        const key = getDayString(startDate);
        if (!tempMap[key]) tempMap[key] = { normals: [] };

        tempMap[key].normals.push({
          ...event
        });
      }
    }

    const finalMap: Record<string, Event[]> = {};
    for (const key in tempMap) {
      finalMap[key] = [...tempMap[key].normals.reverse()];
    }

    return finalMap;
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
</script>

<div class="flex flex-col h-full py-3">
  <div class="grid grid-cols-7 bg-base-200 text-sm sticky top-0 z-10">
    {#each dayLabels as label}
      <div class="h-8 flex items-center justify-center font-semibold">
        {label}
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-7 auto-rows-fr bg-base-100 text-xs rounded-2xl w-full h-full">
    {#each $days as day}
      {@const key = getDayString(day)}
      {@const dayEvents = $eventsByDay[key] || []}
      <button
        class="border border-base-200 px-1 py-1 text-left relative hover:bg-base-300/10 transition-colors flex flex-col items-start"
        onclick={() => {
          currentDate.set(day);
          changeToDayView();
        }}
      >
        <div class="self-end text-xs font-medium mb-1">
          <span
            class:text-primary={isToday(day)}
            class:bg-primary-content={isToday(day)}
            class:font-bold={isToday(day)}
            class:rounded={isToday(day)}
            class:p-[1px]={isToday(day)}
            class:text-base-content={!isToday(day) && isSameMonth(day, $currentDate)}
            class:text-base={!isSameMonth(day, $currentDate)}
          >
            {format(day, "d")}
          </span>
        </div>

        <div class="w-full space-y-1 text-[10px] leading-tight overflow-hidden">
          {#each dayEvents.slice(0, MAX_EVENTS_PER_DAY) as event}
            <div
              class="font-semibold truncate px-1 rounded"
              style:color={getColorHexCodeFromId(event.colorId)}
              title={event.name}
            >
              {event.name}
            </div>
          {/each}

          {#if dayEvents.length > MAX_EVENTS_PER_DAY}
            <div class="font-bold text-base-content/80">
              + {dayEvents.length - MAX_EVENTS_PER_DAY} more
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
