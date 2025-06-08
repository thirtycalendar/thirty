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
</script>

<div
  class="z-10 absolute left-1 right-1 rounded-md p-1 text-xs text-white overflow-hidden cursor-pointer select-none"
  style={`top: ${topPx}px; height: ${heightPx}px; background-color: ${event.color}; pointer-events: auto;`}
  title={event.summary}
>
  <p class="text-primary font-medium">
    {event.summary}
  </p>
</div>
