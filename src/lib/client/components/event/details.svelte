<script lang="ts">
  import {
    Calendar03Icon,
    CheckmarkCircle02Icon,
    Clock01Icon,
    FileSyncIcon,
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

  import { Icon } from "../icons";
  import {
    calculateTimezoneDiffInTime,
    formatDuration,
    formatEventTimeDetails,
    formatLocalTimeDetails,
    getEventDateObjects
  } from "./utils";

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

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{event.name}</h2>

  <div class="flex items-start gap-3">
    <div class="pt-0.5">
      <Icon icon={Clock01Icon} strokeWidth={1.7} absoluteStrokeWidth />
    </div>

    <div class="flex-1">
      <div class="my-1 block items-center gap-2 sm:flex">
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
        <p class="badge badge-outline badge-xs my-1">
          {timezoneDiffInTime}{timezoneDiffInTime && " "}{userTimezone}
        </p>

        <div class="my-1 block items-center gap-2 sm:flex">
          <p class="text-muted-foreground text-sm">{formattedLocalTime}</p>
          <div class="badge badge-outline badge-xs">{userTimezone}</div>
        </div>
      {/if}
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-0.5">
      <Icon icon={Calendar03Icon} strokeWidth={1.7} absoluteStrokeWidth />
    </div>

    <div class="flex flex-1 items-center gap-2">
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
  </div>

  <div class="flex items-start gap-3">
    <div class="pt-0.5">
      <Icon icon={GlobalRefreshIcon} strokeWidth={1.7} absoluteStrokeWidth />
    </div>
    <div class="flex-1">{event.timezone}</div>
  </div>

  {#if event.location}
    <div class="flex items-start gap-3">
      <div class="pt-1.5">
        <Icon icon={MapPinpoint01Icon} strokeWidth={1.7} absoluteStrokeWidth />
      </div>
      <div class="flex-1">{event.location}</div>
    </div>
  {/if}

  {#if event.description}
    <div class="flex items-start gap-3">
      <div class="pt-0.5">
        <Icon icon={TextAlignLeftIcon} strokeWidth={1.7} absoluteStrokeWidth />
      </div>
      <div class="flex-1 whitespace-pre-wrap">{event.description}</div>
    </div>
  {/if}

  <div class="flex items-start gap-3">
    <div class="pt-0.5">
      <Icon icon={CheckmarkCircle02Icon} strokeWidth={1.7} absoluteStrokeWidth />
    </div>

    <div class="flex-1 capitalize">Status: {event.status}</div>
  </div>

  <div class="mt-4 space-y-1">
    {#if event.source !== "local"}
      <div class="flex items-center">
        <Icon icon={FileSyncIcon} size={14} strokeWidth={1.7} class="mr-2" absoluteStrokeWidth />

        <p class="text-sm font-semibold">
          Synced from {capitalizeFirstLetter(event.source)}
        </p>
      </div>
    {/if}

    <div class="flex items-center">
      <Icon icon={UndoIcon} size={14} strokeWidth={1.7} class="mr-2" absoluteStrokeWidth />

      <p class="text-sm font-semibold">
        Last edited: {updated}
      </p>
    </div>
  </div>

  <ActionButtons id={event.id} bind:errorMessage />
</div>
