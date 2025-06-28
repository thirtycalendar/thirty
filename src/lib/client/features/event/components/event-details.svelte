<script lang="ts">
  import {
    AlignLeft,
    CalendarCheck2,
    CircleCheck,
    Clock3,
    Globe,
    MapPin,
    Pen
  } from "@lucide/svelte";

  import { parseISO } from "date-fns";
  import { formatInTimeZone } from "date-fns-tz";

  import type { Event } from "$lib/types";
  import { getColorHexCodeFromId } from "$lib/utils/colors";

  import { getNameFromCalendarId } from "../../calendar/utils";

  import { DeleteEventButton } from ".";

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
    <div class="pt-0.5 text-muted-foreground">
      <Clock3 size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1">
      {#if event.allDay}
        {formattedStart}{#if event.start !== event.end}
          - {formattedEnd}{/if}
      {:else}
        {formattedStart} - {formattedEnd}
      {/if}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-0.5 text-muted-foreground">
      <CalendarCheck2 size="20" strokeWidth="2.5" />
    </div>

    <div class="flex-1 flex items-center gap-2 capitalize">
      <span>Calendar:</span>
      <div
        class="w-5 aspect-square rounded-full"
        style="background-color: {getColorHexCodeFromId(event.colorId)}"
      ></div>
      <span>{getNameFromCalendarId(event.calendarId)}</span>
    </div>
  </div>

  {#if event.location}
    <div class="flex items-start gap-3">
      <div class="pt-0.5 text-muted-foreground">
        <MapPin size="20" strokeWidth="2.5" />
      </div>
      <div class="flex-1">{event.location}</div>
    </div>
  {/if}

  {#if event.description}
    <div class="flex items-start gap-3">
      <div class="pt-0.5 text-muted-foreground">
        <AlignLeft size="20" strokeWidth="2.5" />
      </div>
      <div class="flex-1 whitespace-pre-wrap">{event.description}</div>
    </div>
  {/if}

  <div class="flex items-start gap-3">
    <div class="pt-0.5 text-muted-foreground">
      <CircleCheck size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1 capitalize">
      Status: {event.status}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-0.5 text-muted-foreground">
      <Globe size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1">{event.timezone}</div>
  </div>

  <div class="flex justify-end">
    <DeleteEventButton id={event.id} />

    <button class="btn btn-sm btn-square btn-ghost"><Pen size="17" /></button>
  </div>
</div>
