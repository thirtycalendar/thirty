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
  import { formatInTimeZone, toZonedTime } from "date-fns-tz";

  import { capitalizeFirstLetter } from "$lib/shared/utils/char";
  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import { combineDateTimeUTC } from "$lib/shared/utils/time";
  import type { Event } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";

  import { EventActionButtons } from ".";

  interface EventDetailsProps {
    event: Event;
  }

  let { event }: EventDetailsProps = $props();

  const startUtc = combineDateTimeUTC(event.startDate, event.startTime);
  const endUtc = combineDateTimeUTC(event.endDate, event.endTime);

  const start = toZonedTime(startUtc, event.timezone);
  const end = toZonedTime(endUtc, event.timezone);

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

  const calendarColor = $derived.by(() => getColorHexCodeFromId(event.colorId));

  const { data: calendars } = getCalendars();

  const calendarName = $derived.by(() => {
    return $calendars?.find((cal) => cal.id === event.calendarId)?.name ?? "Unknown calendar";
  });

  const updated = format(new Date(event.updatedAt), "PPp");
</script>

<div class="space-y-3">
  <h2 class="text-xl font-semibold">{event.name}</h2>

  <div class="flex items-start gap-3">
    <div class="pt-0.5 text-muted-foreground">
      <Clock3 size="20" strokeWidth="2.5" />
    </div>
    <div class="flex-1">
      {#if event.allDay}
        <div class="flex items-center gap-2">
          <div class="badge badge-outline badge-sm">All Day</div>
          <div>{formattedStart}</div>
        </div>
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
      <div class="w-5 aspect-square rounded-full" style="background-color: {calendarColor}"></div>
      <span>{calendarName}</span>
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
