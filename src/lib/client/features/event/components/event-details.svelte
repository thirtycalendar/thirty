<script lang="ts">
  import { AlignLeft, CalendarCheck2, CircleCheck, Clock3, Globe, MapPin } from "@lucide/svelte";

  import { parseISO } from "date-fns";
  import { formatInTimeZone } from "date-fns-tz";

  import type { Event } from "$lib/types";

  interface EventDetailsProps {
    event: Event;
  }

  let { event }: EventDetailsProps = $props();

  const start = parseISO(event.start);
  const end = parseISO(event.end);

  const formattedStart = formatInTimeZone(
    start,
    event.timezone,
    event.allDay ? "EEE, MMM d" : "EEE, MMM d · h:mm a"
  );

  const formattedEnd = formatInTimeZone(
    end,
    event.timezone,
    event.allDay ? "EEE, MMM d" : "h:mm a"
  );
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">{event.name}</h2>

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <Clock3 size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1 text-sm">
      {#if event.allDay}
        {formattedStart}{#if event.start !== event.end}
          - {formattedEnd}{/if}
      {:else}
        {formattedStart} - {formattedEnd}
      {/if}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <CalendarCheck2 size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1 text-sm capitalize">
      Calendar: {event.calendarId}
    </div>
  </div>

  {#if event.location}
    <div class="flex items-start gap-3">
      <div class="pt-1.5 text-muted-foreground">
        <MapPin size="20" strokeWidth="2.5" />
      </div>
      <div class="flex-1 text-sm">{event.location}</div>
    </div>
  {/if}

  {#if event.description}
    <div class="flex items-start gap-3">
      <div class="pt-1.5 text-muted-foreground">
        <AlignLeft size="20" strokeWidth="2.5" />
      </div>
      <div class="flex-1 text-sm whitespace-pre-wrap">{event.description}</div>
    </div>
  {/if}

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <CircleCheck size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1 text-sm capitalize">
      Status: {event.status}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-1.5 text-muted-foreground">
      <Globe size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1 text-sm">{event.timezone}</div>
  </div>
</div>
