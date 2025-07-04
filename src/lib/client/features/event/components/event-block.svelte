<script lang="ts">
  import { differenceInMinutes, startOfHour } from "date-fns";
  import { toZonedTime } from "date-fns-tz";

  import { handleEventModal } from "$lib/client/stores/event";

  import type { Event } from "$lib/types";
  import { getColorHexCodeFromId } from "$lib/utils/colors";

  import { getColorIdFromCalendarId } from "../../calendar/utils";

  interface EventBlockProps {
    event: Event;
    offset?: number;
  }

  let { event, offset = 0 }: EventBlockProps = $props();

  const start = toZonedTime(event.start, event.timezone);
  const end = toZonedTime(event.end, event.timezone);

  const eventColor = $derived.by(() => getColorHexCodeFromId(event.colorId));
  const calendarColor = $derived.by(() =>
    getColorHexCodeFromId(getColorIdFromCalendarId(event.calendarId))
  );

  const hourHeight = 60;
  const minuteHeight = hourHeight / 60;

  const verticalGap = 2;
  const topPx = differenceInMinutes(start, startOfHour(start)) * minuteHeight + verticalGap;
  const heightPx = differenceInMinutes(end, start) * minuteHeight - verticalGap;

  const horizontalOffsetPx = offset * 10;

  function formatTimeRange(start: Date, end: Date): string {
    const isSamePeriod = (a: Date, b: Date) => a.getHours() < 12 === b.getHours() < 12;

    const formatTime = (d: Date, showPeriod = true) => {
      const h = d.getHours() % 12 || 12;
      const m = d.getMinutes();
      const suffix = d.getHours() < 12 ? "am" : "pm";
      return m
        ? `${h}:${m.toString().padStart(2, "0")}${showPeriod ? ` ${suffix}` : ""}`
        : `${h}${showPeriod ? ` ${suffix}` : ""}`;
    };

    const showPeriodOnStart = !isSamePeriod(start, end);
    const startStr = formatTime(start, showPeriodOnStart);
    const endStr = formatTime(end);

    return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
  }

  function formatStartTime(d: Date): string {
    const h = d.getHours() % 12 || 12;
    const m = d.getMinutes();
    const suffix = d.getHours() < 12 ? "am" : "pm";
    return m ? `${h}:${m.toString().padStart(2, "0")} ${suffix}` : `${h} ${suffix}`;
  }
</script>

<button
  class="absolute left-1 right-1 z-10 text-white cursor-pointer select-none overflow-hidden rounded-xl flex items-start gap-1 backdrop-blur-md border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-200"
  style={`top: ${topPx}px; height: ${heightPx}px; background-color: ${eventColor}33; pointer-events: auto; transform: translateX(${horizontalOffsetPx}px);`}
  title={event.name}
  onclick={() => handleEventModal(event)}
>
  <!-- Accent bar -->
  <div class="w-1 h-full rounded-sm shrink-0" style={`background-color: ${calendarColor};`}></div>

  <div class="w-full text-left p-1">
    {#if heightPx < 28}
      <p
        class={`${heightPx < 24 ? "text-[10px]" : "text-xs"} ${heightPx < 40 ? "truncate" : ""} text-white/90`}
      >
        {event.name}, {formatStartTime(start)}
      </p>
    {:else}
      <div class="py-0.5 space-y-0.5">
        <p
          class="text-xs font-semibold text-white/90"
          class:truncate={heightPx < 40}
          class:line-clamp-2={heightPx >= 40 && heightPx < 60}
        >
          {event.name}
        </p>
        <p class="text-[10px] text-white/70 truncate">
          {formatTimeRange(start, end)}
        </p>
      </div>
    {/if}
  </div>
</button>
