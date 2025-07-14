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

  import {
    formatDuration,
    formatEventTimeDetails,
    formatLocalTimeDetails,
    getEventDateObjects
  } from "$lib/client/features/event/utils";
  import { isSm } from "$lib/client/stores/responsive";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { getValidTimeZone } from "$lib/shared/utils/timezone";
  import type { Event } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";

  import { EventActionButtons } from ".";

  interface Props {
    event: Event;
  }

  let { event }: Props = $props();

  const { start, end } = $derived.by(() => getEventDateObjects(event));

  const userTimezone = getValidTimeZone();
  const normalizedEventTimezone = $derived.by(() => getValidTimeZone(event.timezone));
  const sameTimezone = $derived(normalizedEventTimezone === userTimezone);

  const formattedEventTime = $derived.by(() => formatEventTimeDetails(event, start, end));
  const formattedLocalTime = $derived.by(() =>
    formatLocalTimeDetails(event, start, end, sameTimezone)
  );
  const totalDuration = $derived.by(() => formatDuration(start, end));

  const { data: calendars } = getCalendars();

  const calendar = $derived.by(() => $calendars?.find((cal) => cal.id === event.calendarId));
  const calendarName = $derived(calendar?.name ?? "Unknown");

  const calendarColor = $derived(getColorHexCodeFromId(calendar?.colorId || "-1"));
  const eventColor = $derived(getColorHexCodeFromId(event.colorId));
  const isSameColor = $derived(eventColor === calendarColor);

  const updated = format(new Date(event.updatedAt), "PPp");

  let previousEventId = $derived(event.id);
  let errorMessage = $derived(previousEventId !== event.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{event.name}</h2>

  <div class="flex items-start gap-3">
    <Clock3 size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />
    <div class="flex-1">
      <div class={`${$isSm ? "flex" : "block my-1"} gap-2 items-center`}>
        <p class="font-medium">{formattedEventTime}</p>

        {#if event.allDay}
          <div class="badge badge-outline badge-xs">All Day</div>
        {:else}
          <div class="badge badge-outline badge-xs">
            {totalDuration}
          </div>
        {/if}
      </div>

      {#if formattedLocalTime}
        <div class={`${$isSm ? "flex" : "block my-1"} items-center gap-2`}>
          <p class="text-sm text-muted-foreground">{formattedLocalTime}</p>
          <div class="badge badge-outline badge-xs">{userTimezone}</div>
        </div>
      {/if}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <CalendarCheck2 size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1 flex items-center gap-2 capitalize">
      <div
        class="w-5 h-5 aspect-square rounded-full shrink-0"
        style={`background: ${
          isSameColor
            ? eventColor
            : `linear-gradient(to right, ${calendarColor} 50%, ${eventColor} 50%)`
        };`}
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

  <EventActionButtons id={event.id} bind:errorMessage />
</div>
