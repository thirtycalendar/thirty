<script lang="ts">
  import { differenceInMinutes, startOfDay } from "date-fns";

  import { getCalendars } from "$lib/client/data/queries/calendar";
  import { eventModal } from "$lib/client/stores/modal";

  import type { Event } from "$lib/shared/types";

  import { formatEventTime, formatTimeRange } from "./utils";

  interface Props {
    event: Event;
    start: Date;
    end: Date;
    offset?: number;
  }

  let { event, start, end, offset = 0 }: Props = $props();

  const eventColor = $derived(event.color);

  const { data: calendars } = getCalendars();
  const calendarColor = $derived.by(() => {
    const color = $calendars?.find((cal) => cal.id === event.calendarId)?.color ?? "transparent";
    return color;
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
  class="text-primary-content border-primary-content/10 absolute z-10 flex cursor-pointer items-start gap-1 overflow-hidden rounded-xl border p-0 shadow-md backdrop-blur-md transition-shadow duration-200 select-none hover:shadow-lg"
  style={`
    top: ${topPx}px;
    height: ${Math.max(0, heightPx)}px;
    background-color: ${eventColor}33;
    left: calc(${offset * 12}% + 4px); /* Stagger overlapping events */
    right: 4px;
    z-index: ${10 + offset};
  `}
  title={event.name}
  onclick={() => eventModal.handleModal(event)}
>
  <div class="h-full w-1 shrink-0 rounded-l-md" style="background-color: {calendarColor};"></div>
  <div class="w-full overflow-hidden p-1 text-left">
    {#if heightPx < 28}
      <p class="text-primary-content/90 truncate text-xs font-medium">
        {event.name}, {formatEventTime(start)}
      </p>
    {:else}
      <div class="space-y-0.5">
        <p class="text-primary-content/90 text-sm font-semibold" class:truncate={heightPx < 45}>
          {event.name}
        </p>
        <p class="text-primary-content/70 truncate text-xs">
          {formatTimeRange(start, end)}
        </p>
      </div>
    {/if}
  </div>
</button>
