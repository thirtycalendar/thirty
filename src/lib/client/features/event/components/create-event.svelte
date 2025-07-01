<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  import { addMinutes, format } from "date-fns";

  import type { EventDataType, EventForm as EventFromType } from "$lib/types";

  import { EventForm } from ".";

  const now = new Date();

  const eventData: Writable<EventDataType> = writable({
    calendarId: "",
    colorId: "",
    startDate: format(now, "yyyy-MM-dd"),
    startTime: format(now, "HH:mm"),
    endDate: format(now, "yyyy-MM-dd"),
    endTime: format(addMinutes(now, 30), "HH:mm"),
    timezone: ""
  });

  const defaultValues: EventFromType = {
    calendarId: "",
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    colorId: "",
    start: "",
    end: "",
    timezone: "",
    allDay: false,
    status: "confirmed"
  };

  async function onSubmit(data: EventFromType) {
    console.log("Data:", data);
  }
</script>

<EventForm {eventData} {defaultValues} {onSubmit} />
