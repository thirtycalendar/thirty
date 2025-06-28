<script lang="ts">
  import {
    addDays,
    differenceInCalendarWeeks,
    endOfDay,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    isToday,
    startOfDay,
    startOfMonth,
    startOfWeek
  } from "date-fns";
  import { toZonedTime } from "date-fns-tz";

  import { changeToDayView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Event } from "$lib/types";
  import { getColorHexCodeFromId } from "$lib/utils/colors";

  interface MonthCalendarProps {
    events: Event[];
  }

  let { events }: MonthCalendarProps = $props();

  const calendarTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const MAX_EVENTS_PER_DAY = 4;
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDayString = (date: Date) => format(date, "yyyy-MM-dd");

  const rowsCount = $derived.by(() => {
    const start = startOfWeek(startOfMonth($currentDate));
    const end = endOfWeek(endOfMonth($currentDate));
    return differenceInCalendarWeeks(end, start) + 1;
  });

  const days = $derived.by(() => {
    const start = startOfWeek(startOfMonth($currentDate));
    return Array.from({ length: rowsCount * 7 }, (_, i) => addDays(start, i));
  });

  const eventsByDay = $derived.by(() => {
    const monthStart = startOfDay(days[0]);
    const monthEnd = endOfDay(days[days.length - 1]);
    const map: Record<string, Event[]> = {};

    for (const event of events) {
      if (!event?.id) continue;

      const isVisible = !($checkedCalendars[event.calendarId] === false);
      if (!isVisible) continue;

      const eventStartTz = toZonedTime(event.start, calendarTimezone);
      const eventEndTz = toZonedTime(event.end, calendarTimezone);

      if (eventStartTz > monthEnd || eventEndTz < monthStart) continue;

      const dayCursorStart = eventStartTz < monthStart ? monthStart : eventStartTz;
      const dayCursorEnd = eventEndTz > monthEnd ? monthEnd : eventEndTz;

      let cursor = startOfDay(dayCursorStart);
      while (cursor <= dayCursorEnd) {
        const key = getDayString(cursor);
        if (!map[key]) map[key] = [];
        map[key].push(event);
        cursor = addDays(cursor, 1);
      }
    }

    // Sort events within each day
    for (const key in map) {
      map[key].sort(
        (a, b) =>
          toZonedTime(a.start, calendarTimezone).getTime() -
          toZonedTime(b.start, calendarTimezone).getTime()
      );
    }

    return map;
  });
</script>

<div class="flex flex-col h-full py-3">
  <div class="grid grid-cols-7 bg-base-200 text-sm sticky top-0 z-10">
    {#each dayLabels as label}
      <div class="h-8 flex items-center justify-center font-semibold">{label}</div>
    {/each}
  </div>

  <div
    class="grid grid-cols-7 auto-rows-fr bg-base-100 text-xs rounded-2xl w-full h-full"
    style="grid-template-rows: repeat({rowsCount}, minmax(0, 1fr))"
  >
    {#each days as day}
      {@const key = getDayString(day)}
      {@const dayEvents = eventsByDay[key] || []}
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
            class:opacity-40={!isSameMonth(day, $currentDate)}
          >
            {format(day, "d")}
          </span>
        </div>

        <div class="w-full space-y-1 text-[10px] leading-tight overflow-hidden">
          {#each dayEvents.slice(0, MAX_EVENTS_PER_DAY) as event}
            <div
              class="truncate px-1.5 py-0.5 text-[10px] font-medium rounded-full shadow-sm backdrop-blur-sm border border-white/10"
              style={`background-color: ${getColorHexCodeFromId(event.colorId)}22; color: ${getColorHexCodeFromId(event.colorId)};`}
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
