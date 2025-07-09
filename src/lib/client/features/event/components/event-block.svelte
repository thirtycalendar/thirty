<script lang="ts">
  import { differenceInMinutes, startOfDay } from "date-fns";

  import { formatEventTime, formatTimeRange } from "$lib/client/features/event/utils";
  import { handleEventModal } from "$lib/client/stores/event";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Event } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";

  interface EventBlockProps {
    event: Event;
    start: Date; // Event's start time for this specific block
    end: Date; // Event's end time for this specific block
    offset?: number;
  }
  let { event, start, end, offset = 0 }: EventBlockProps = $props();

  const eventColor = $derived(getColorHexCodeFromId(event.colorId));
  const { data: calendars } = getCalendars();
  const calendarColor = $derived.by(() => {
    const colorId = $calendars?.find((cal) => cal.id === event.calendarId)?.colorId ?? "-1";
    return getColorHexCodeFromId(colorId);
  });

  const hourHeight = 60; // h-15 = 15rem * 4px/rem = 60px
  const minuteHeight = hourHeight / 60;
  const verticalGap = 2;

  const topPx = $derived(
    differenceInMinutes(start, startOfDay(start)) * minuteHeight + verticalGap
  );
  const heightPx = $derived(differenceInMinutes(end, start) * minuteHeight - verticalGap);
</script>

<button
  class="absolute z-10 text-primary-content cursor-pointer select-none overflow-hidden rounded-xl flex items-start gap-1 backdrop-blur-md border border-primary-content/10 shadow-md hover:shadow-lg transition-shadow duration-200 p-0"
  style={`
    top: ${topPx}px;
    height: ${Math.max(0, heightPx)}px;
    background-color: ${eventColor}33;
    left: calc(${offset * 12}% + 4px); /* Stagger overlapping events */
    right: 4px;
    z-index: ${100 + offset};
  `}
  title={event.name}
  onclick={() => handleEventModal(event)}
>
  <div class="w-1 h-full rounded-l-md shrink-0" style="background-color: {calendarColor};"></div>
  <div class="w-full text-left p-1 overflow-hidden">
    {#if heightPx < 28}
      <p class="text-xs font-medium text-primary-content/90 truncate">
        {event.name}, {formatEventTime(start)}
      </p>
    {:else}
      <div class="space-y-0.5">
        <p class="text-sm font-semibold text-primary-content/90" class:truncate={heightPx < 45}>
          {event.name}
        </p>
        <p class="text-xs text-primary-content/70 truncate">
          {formatTimeRange(start, end)}
        </p>
      </div>
    {/if}
  </div>
</button>
