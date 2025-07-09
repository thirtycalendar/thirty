<script lang="ts">
  import { endOfDay, format, isToday, isWithinInterval, setHours, startOfDay } from "date-fns";

  import { calculateEventOffsets, getEventDateObjects } from "$lib/client/features/event/utils";
  import { currentDate } from "$lib/client/stores/change-date";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";
  import { handleEventModal } from "$lib/client/stores/event";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Event } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";
  import { EventBlock } from "../../event/components";

  import { CurrentTimeIndicator } from ".";

  interface DayCalendarProps {
    events: Event[];
  }
  let { events }: DayCalendarProps = $props();

  const { data: calendars } = getCalendars();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayStart = $derived(startOfDay($currentDate));
  const dayEnd = $derived(endOfDay($currentDate));

  const { allDayEvents, timedEvents } = $derived.by(() => {
    const all: Event[] = [];
    const timed: Event[] = [];

    for (const event of events) {
      const isVisible = $checkedCalendars[event.calendarId] !== false;
      if (!isVisible) continue;

      const { start, end } = getEventDateObjects(event);
      const isForToday =
        isWithinInterval(start, { start: dayStart, end: dayEnd }) ||
        isWithinInterval(end, { start: dayStart, end: dayEnd }) ||
        (start < dayStart && end > dayEnd);

      if (!isForToday) continue;
      if (event.allDay) all.push(event);
      else timed.push(event);
    }
    return { allDayEvents: all, timedEvents: timed };
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
</script>

<div class="flex flex-col h-full py-3">
  <div class="bg-base-200 sticky top-0 z-10 border-b border-base-200 px-1 py-1">
    <div
      class={`font-semibold text-center ${isToday($currentDate) ? "text-primary-content" : "text-primary-content/70"}`}
    >
      {format($currentDate, "EEEE, MMM d")}
    </div>
  </div>

  {#if allDayEvents.length > 0}
    <div class="bg-base-200 border-b border-base-200 grid grid-cols-[50px_1fr] p-1 gap-x-1">
      <div></div>
      <div class="flex flex-col gap-1 py-1">
        {#each allDayEvents as event (event.id)}
          {@const eventColor = getColorHexCodeFromId(event.colorId)}
          {@const calendar = $calendars?.find((c) => c.id === event.calendarId)}
          {@const calendarColor = getColorHexCodeFromId(calendar?.colorId ?? "-1")}
          <button
            class="text-primary-content w-full cursor-pointer rounded-md flex items-center gap-1.5 backdrop-blur-md border border-primary-content/10 shadow-sm p-0 text-left h-[26px]"
            style:background-color="{eventColor}33"
            title={event.name}
            onclick={() => handleEventModal(event)}
          >
            <div
              class="w-1 h-full rounded-l-md shrink-0"
              style:background-color={calendarColor}
            ></div>
            <div class="px-1 py-0.5 overflow-hidden">
              <p class="text-xs font-semibold text-primary-content/90 truncate">{event.name}</p>
            </div>
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <div
    bind:this={scrollContainer}
    class="flex-1 overflow-y-auto overflow-x-hidden bg-base-100 relative rounded-2xl"
  >
    <div class="grid grid-cols-[50px_1fr] relative">
      {#each hours as hour (hour)}
        <div
          class="col-start-1 h-15 flex justify-center items-center select-none leading-none text-xs text-primary-content/70 border-r border-b border-base-200"
        >
          {format(setHours(new Date(), hour), "h a")}
        </div>
        <div class="col-start-2 border-b border-base-200"></div>
      {/each}

      <div class="col-start-2 row-start-1 col-span-1 row-span-full relative pointer-events-none">
        <div class="absolute inset-0 pointer-events-auto">
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
