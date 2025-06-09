<script lang="ts">
  import { differenceInMinutes, parseISO, startOfHour } from "date-fns";

  import type { Event } from "$lib/types";

  interface EventBlockProps {
    event: Event;
  }

  let { event }: EventBlockProps = $props();

  const start = parseISO(event.start.dateTime);
  const end = parseISO(event.end.dateTime);

  const hourHeight = 60;
  const minuteHeight = hourHeight / 60;

  const topPx = differenceInMinutes(start, startOfHour(start)) * minuteHeight;
  const heightPx = differenceInMinutes(end, start) * minuteHeight;

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
</script>

<div
  class="absolute left-1 right-1 z-10 p-1 text-xs text-white cursor-pointer select-none opacity-90 overflow-hidden rounded-md flex items-start gap-1"
  style={`top: ${topPx}px; height: ${heightPx}px; background-color: ${event.bgColor}; pointer-events: auto;`}
  title={event.summary}
>
  <!-- Color bar -->
  <div class="w-1 rounded-sm shrink-0" style={`background-color: ${event.color};`}></div>

  <div class="text-primary">
    <p class="text-xs font-medium truncate" style={`background-color: ${event.bgColor};`}>
      {event.summary}
    </p>
    <p class="text-[10px] truncate">
      {formatTimeRange(start, end)}
    </p>
  </div>
</div>
