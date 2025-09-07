<script lang="ts">
  import {
    Calendar03Icon,
    CheckmarkCircle02Icon,
    Clock01Icon,
    GlobalRefreshIcon,
    MapPinpoint01Icon,
    TextAlignLeftIcon,
    UndoIcon
  } from "@hugeicons/core-free-icons";

  import { format } from "date-fns";

  import { calendarsQuery } from "$lib/client/data/queries";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import { getValidTimeZone } from "$lib/shared/utils/timezone";
  import type { Event } from "$lib/shared/types";

  import {
    calculateTimezoneDiffInTime,
    formatDuration,
    formatEventTimeDetails,
    formatLocalTimeDetails,
    getEventDateObjects
  } from "./utils";

  import { DetailMetaRow, IconRow } from "..";
  import { ActionButtons } from ".";

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
  const timezoneDiffInTime = $derived.by(() =>
    calculateTimezoneDiffInTime(start, userTimezone, normalizedEventTimezone, sameTimezone)
  );

  const { data: calendars } = calendarsQuery();

  const calendar = $derived.by(() => $calendars?.find((cal) => cal.id === event.calendarId));
  const calendarName = $derived(calendar?.name ?? "Unknown");

  const calendarColor = $derived(calendar?.color || "transparent");
  const eventColor = $derived(event.color);
  const isSameColor = $derived(eventColor === calendarColor);

  const updated = $derived(format(new Date(event.updatedAt), "PPp"));

  let prevId = $derived(event.id);
  let errorMessage = $derived(prevId !== event.id ? "" : "");
</script>

<div class="detail-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <h2 class="detail-title">{event.name}</h2>

  <!-- Time -->
  <IconRow icon={Clock01Icon}>
    <div class="my-1 block items-center gap-2 sm:flex">
      <p class="font-medium">{formattedEventTime}</p>
      {#if event.allDay}
        <div class="detail-badge whitespace-nowrap">All Day</div>
      {:else}
        <div class="detail-badge whitespace-nowrap">{totalDuration}</div>
      {/if}
    </div>

    {#if formattedLocalTime}
      <p class="detail-badge my-1">
        {timezoneDiffInTime}{timezoneDiffInTime && " "}{userTimezone}
      </p>
      <div class="my-1 block items-center gap-2 sm:flex">
        <p class="text-muted-foreground text-sm">{formattedLocalTime}</p>
        <div class="detail-badge">{userTimezone}</div>
      </div>
    {/if}
  </IconRow>

  <!-- Calendar -->
  <IconRow icon={Calendar03Icon}>
    <div class="flex items-center gap-2">
      <div
        class="aspect-square h-5 w-5 shrink-0 rounded-full"
        style={`background: ${
          isSameColor
            ? eventColor
            : `linear-gradient(to right, ${calendarColor} 50%, ${eventColor} 50%)`
        };`}
      ></div>
      <span>{calendarName}</span>
    </div>
  </IconRow>

  <!-- Timezone -->
  <IconRow icon={GlobalRefreshIcon}>
    <div>{event.timezone}</div>
  </IconRow>

  <!-- Location -->
  {#if event.location}
    <IconRow icon={MapPinpoint01Icon}>
      <div>{event.location}</div>
    </IconRow>
  {/if}

  <!-- Description -->
  {#if event.description}
    <IconRow icon={TextAlignLeftIcon} class="items-start" iconClass="pt-0.5">
      <div class="whitespace-pre-wrap">{event.description}</div>
    </IconRow>
  {/if}

  <!-- Status -->
  <IconRow icon={CheckmarkCircle02Icon}>
    <div class="capitalize">Status: {event.status}</div>
  </IconRow>

  <!-- Meta rows -->
  <div class="detail-meta-section">
    <DetailMetaRow icon={CheckmarkCircle02Icon}>
      Synced from {capitalizeFirstLetter(event.source)}
    </DetailMetaRow>

    <DetailMetaRow icon={UndoIcon}>
      Last edited: {updated}
    </DetailMetaRow>
  </div>

  <ActionButtons id={event.id} bind:errorMessage />
</div>
