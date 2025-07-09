<script lang="ts">
  import {
    AlignLeft,
    CalendarCheck2,
    CircleCheck,
    Clock3,
    Globe,
    HistoryIcon,
    MapPin,
    RefreshCcw
  } from "@lucide/svelte";

  import { format } from "date-fns";
  import { formatInTimeZone } from "date-fns-tz";

  import { getEventDateObjects } from "$lib/client/features/event/utils";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { getValidTimeZone } from "$lib/shared/utils/timezone";
  import type { Event } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";

  import { EventActionButtons } from ".";

  interface EventDetailsProps {
    event: Event;
  }

  let { event }: EventDetailsProps = $props();

  const { start, end } = getEventDateObjects(event, false);

  const userTimezone = getValidTimeZone();
  const normalizedEventTimezone = getValidTimeZone(event.timezone);
  const sameTimezone = $derived(normalizedEventTimezone === userTimezone);

  const formattedEventTime = $derived.by(() => {
    const formatString = event.allDay ? "EEE, MMM d" : "EEE, MMM d · h:mm a";
    const startFormatted = formatInTimeZone(start, event.timezone, formatString);
    if (event.allDay) return startFormatted;
    const endFormatted = formatInTimeZone(end, event.timezone, "h:mm a");
    return `${startFormatted} - ${endFormatted}`;
  });

  const formattedLocalTime = $derived.by(() => {
    if (sameTimezone) return "";

    const formatString = event.allDay ? "EEE, MMM d" : "EEE, MMM d · h:mm a";
    const startFormatted = format(start, formatString);
    if (event.allDay) return startFormatted;
    const endFormatted = format(end, "h:mm a");
    return `${startFormatted} - ${endFormatted}`;
  });

  const calendarColor = $derived(getColorHexCodeFromId(event.colorId));

  const { data: calendars } = getCalendars();

  const calendarName = $derived.by(
    () => $calendars?.find((cal) => cal.id === event.calendarId)?.name ?? "Unknown"
  );

  const updated = format(new Date(event.updatedAt), "PPp");
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">{event.name}</h2>

  <div class="flex items-start gap-3">
    <Clock3 size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />
    <div class="flex-1">
      <p class="font-medium">{formattedEventTime}</p>
      {#if formattedLocalTime}
        <div class="flex gap-1 items-center">
          <p class="text-sm text-muted-foreground">{formattedLocalTime}</p>
          <div class="badge badge-outline badge-xs">{userTimezone}</div>
        </div>
      {/if}
      {#if event.allDay}
        <div class="badge badge-outline badge-sm">All Day</div>
      {/if}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <CalendarCheck2 size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1 flex items-center gap-2 capitalize">
      <div
        class="w-5 h-5 aspect-square rounded-full"
        style="background-color: {calendarColor}"
      ></div>
      <span>{calendarName}</span>
    </div>
  </div>

  <div class="flex items-start gap-3">
    <Globe size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1">{event.timezone}</div>
  </div>

  {#if event.location}
    <div class="flex items-start gap-3">
      <MapPin size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

      <div class="flex-1">{event.location}</div>
    </div>
  {/if}

  {#if event.description}
    <div class="flex items-start gap-3">
      <AlignLeft size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

      <div class="flex-1 whitespace-pre-wrap">{event.description}</div>
    </div>
  {/if}

  <div class="flex items-start gap-3">
    <CircleCheck size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1 capitalize">Status: {event.status}</div>
  </div>

  <div class="mt-4 space-y-1">
    {#if event.source !== "local"}
      <div class="flex items-center">
        <RefreshCcw size="14" strokeWidth="2.5" class="mr-2" />
        <p class="text-sm font-semibold">
          Synced from {capitalizeFirstLetter(event.source)}
        </p>
      </div>
    {/if}

    <div class="flex items-center">
      <HistoryIcon size="14" strokeWidth="2.5" class="mr-2" />
      <p class="text-sm font-semibold">
        Last edited: {updated}
      </p>
    </div>
  </div>
  <EventActionButtons id={event.id} />
</div>
