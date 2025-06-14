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

  import type { Event, UtilEvent } from "$lib/types";

  import { getEventBgColor, getEventColor } from "../../utils/get-colors";

  interface MonthCalendarProps {
    events: Event[];
    utilEvents: UtilEvent[];
  }

  type DisplayProperties = {
    color: string | null | undefined;
    isUtilEvent: boolean;
  };

  type DisplayEvent = (Event & DisplayProperties) | (UtilEvent & DisplayProperties);

  let { events, utilEvents }: MonthCalendarProps = $props();

  const MAX_EVENTS_PER_DAY = 4;

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek(startOfMonth($currentDate));
    const end = endOfWeek(endOfMonth($currentDate));
    return Array.from(
      { length: Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1 },
      (_, i) => addDays(start, i)
    );
  });

  function normalizeUtilEventDate(dateStr: string) {
    return parseISO(dateStr);
  }

  const getDayString = (date: Date) => format(date, "yyyy-MM-dd");

  const eventsByDay = derived([days, checkedCalendars], ([$days, $checkedCalendars]) => {
    const start = $days[0];
    const end = endOfDay($days[$days.length - 1]);

    const tempMap: Record<string, { utils: DisplayEvent[]; normals: DisplayEvent[] }> = {};

    for (const event of utilEvents) {
      const isVisible =
        !(event.calendarId in $checkedCalendars) || $checkedCalendars[event.calendarId];
      if (!isVisible) continue;

      const date = normalizeUtilEventDate(event.date.dateTime);
      if (isWithinInterval(date, { start, end })) {
        const key = getDayString(date);
        if (!tempMap[key]) tempMap[key] = { utils: [], normals: [] };

        tempMap[key].utils.push({
          ...event,
          color: getEventColor(event.calendarId),
          isUtilEvent: true
        });
      }
    }

    for (const event of events) {
      const isVisible =
        !(event.calendarId in $checkedCalendars) || $checkedCalendars[event.calendarId];
      if (!isVisible) continue;

      const startDate = parseISO(event.start.dateTime);
      if (isWithinInterval(startDate, { start, end })) {
        const key = getDayString(startDate);
        if (!tempMap[key]) tempMap[key] = { utils: [], normals: [] };

        tempMap[key].normals.push({
          ...event,
          color: event.colorId ? getEventBgColor(event.colorId) : getEventColor(event.calendarId),
          isUtilEvent: false
        });
      }
    }

    const finalMap: Record<string, DisplayEvent[]> = {};
    for (const key in tempMap) {
      finalMap[key] = [...tempMap[key].utils, ...tempMap[key].normals.reverse()];
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
              style:background-color={event.isUtilEvent ? event.color : "transparent"}
              style:color={event.isUtilEvent ? "black" : event.color}
              title={event.summary}
            >
              {event.summary}
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
