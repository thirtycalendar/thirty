<script lang="ts">
  import { differenceInMinutes, parseISO, startOfDay } from "date-fns";

  import type { Event } from "$lib/types";

  interface EventBlockProps {
    event: Event;
  }

  let { event }: EventBlockProps = $props();

  console.log("event:", event);

  const start = parseISO(event.start.dateTime);
  const end = parseISO(event.end.dateTime);

  const hourHeight = 60;
  const minuteHeight = hourHeight / 60;

  // Calculate top offset and height
  const startOfDayDate = startOfDay(start);
  const topPx = differenceInMinutes(start, startOfDayDate) * minuteHeight;
  const heightPx = differenceInMinutes(end, start) * minuteHeight;

  // Use event color or default
  const bgColor = event.colorId ? `var(--color-calendar-${event.colorId})` : "bg-primary";
</script>

<div
  class="absolute left-1 right-1 rounded-md p-1 text-xs text-white overflow-hidden cursor-pointer select-none"
  style={`top: ${topPx}px; height: ${heightPx}px; background-color: ${bgColor};`}
  title={event.summary}
>
  {event.summary}
</div>
