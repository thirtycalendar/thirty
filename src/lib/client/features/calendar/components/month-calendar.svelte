<script lang="ts">
  import { derived } from "svelte/store";

  import {
    addDays,
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

  interface MonthCalendarProps {
    events: Event[];
    utilEvents: UtilEvent[];
  }

  let { events, utilEvents }: MonthCalendarProps = $props();

  const MAX_EVENTS_PER_DAY = 4;

  const days = derived(currentDate, ($currentDate) => {
    const start = startOfWeek(startOfMonth($currentDate));
    const end = endOfWeek(endOfMonth($currentDate));

    const result: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      result.push(d);
    }
    return result;
  });

  function normalizeUtilEventDate(dateStr: string) {
    return parseISO(dateStr);
  }

  const eventsByDay = derived(
    [currentDate, checkedCalendars],
    ([$currentDate, $checkedCalendars]) => {
      const monthStart = startOfWeek(startOfMonth($currentDate));
      const monthEnd = endOfWeek(endOfMonth($currentDate));

      const dailyEventsMap: Record<
        string,
        { summary: string; color: string | null | undefined; isUtilEvent: boolean }[]
      > = {};

      const addEventToMap = (
        date: Date,
        event: { summary: string; bgColor?: string | null | undefined },
        isUtilEvent: boolean
      ) => {
        const dayKey = format(date, "yyyy-MM-dd");
        if (!dailyEventsMap[dayKey]) {
          dailyEventsMap[dayKey] = [];
        }
        dailyEventsMap[dayKey].push({
          summary: event.summary,
          color: event.bgColor,
          isUtilEvent
        });
      };

      // Process Util Events (all-day)
      utilEvents.forEach((event) => {
        const isVisible =
          !(event.calendarId in $checkedCalendars) || $checkedCalendars[event.calendarId];
        if (!isVisible) return;

        const eventDate = normalizeUtilEventDate(event.date.dateTime);
        if (isWithinInterval(eventDate, { start: monthStart, end: monthEnd })) {
          addEventToMap(eventDate, event, true); // Mark as util event
        }
      });

      // Process Timed Events
      events.forEach((event) => {
        const isVisible =
          !(event.calendarId in $checkedCalendars) || $checkedCalendars[event.calendarId];
        if (!isVisible) return;

        const startDate = parseISO(event.start.dateTime);
        if (isWithinInterval(startDate, { start: monthStart, end: monthEnd })) {
          addEventToMap(startDate, event, false); // Mark as regular event
        }
      });

      return dailyEventsMap;
    }
  );

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

  <div class="grid grid-cols-7 grid-rows-5 h-full bg-base-100 text-xs rounded-2xl w-full">
    {#each $days as day}
      {@const dayKey = format(day, "yyyy-MM-dd")}
      {@const dayEvents = $eventsByDay[dayKey] || []}
      <button
        class="border border-base-200 px-1 py-1 text-left relative hover:bg-base-300/10 transition-colors flex flex-col items-start"
        onclick={() => {
          currentDate.set(day);
          changeToDayView();
        }}
      >
        <div class="self-end text-xs font-medium mb-1">
          <span
            class:select-none={true}
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
              style:background-color={event.isUtilEvent
                ? event.color || "var(--fallback-bg-color, #ccc)"
                : "transparent"}
              style:color={event.isUtilEvent
                ? "white"
                : event.color || "var(--fallback-text-color, #333)"}
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
