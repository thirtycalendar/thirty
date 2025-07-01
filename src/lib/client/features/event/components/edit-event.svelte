<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  import { addMinutes, format } from "date-fns";

  import type { Event, EventDataType, EventForm as EventFromType } from "$lib/types";

  import { EventForm } from ".";

  interface EditEventProps {
    event: Event;
  }

  let { event }: EditEventProps = $props();

  const now = new Date();

  const eventData: Writable<EventDataType> = writable({
    calendarId: event.calendarId,
    colorId: event.colorId,
    startDate: format(now, "yyyy-MM-dd"),
    startTime: format(now, "HH:mm"),
    endDate: format(now, "yyyy-MM-dd"),
    endTime: format(addMinutes(now, 30), "HH:mm"),
    timezone: event.timezone
  });

  const defaultValues: EventFromType = {
    calendarId: event.calendarId,
    externalId: event.externalId,
    source: event.source,
    name: event.name,
    description: event.description,
    location: event.location,
    colorId: event.colorId,
    start: event.start,
    end: event.end,
    timezone: event.timezone,
    allDay: event.allDay,
    status: event.status
  };

  async function onSubmit(data: EventFromType) {
    console.log("Data:", data);
  }
</script>

<EventForm {eventData} {defaultValues} {onSubmit} />
