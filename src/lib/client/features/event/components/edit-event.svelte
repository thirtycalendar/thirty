<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  import { format, parseISO } from "date-fns";

  import { handleEventStopEditing } from "$lib/client/stores/event";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Event, EventDataType, EventForm as EventFormType } from "$lib/types";

  import { EventForm } from ".";

  interface EditEventProps {
    event: Event;
  }

  let { event }: EditEventProps = $props();

  const start = parseISO(event.start);
  const end = parseISO(event.end);

  const eventData: Writable<EventDataType> = writable({
    calendarId: event.calendarId,
    colorId: event.colorId,
    startDate: format(start, "yyyy-MM-dd"),
    startTime: format(start, "HH:mm"),
    endDate: format(end, "yyyy-MM-dd"),
    endTime: format(end, "HH:mm"),
    timezone: event.timezone
  });

  const defaultValues: EventFormType = {
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

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: EventFormType) => {
      const res = await client.api.event.update[":id"].$put({
        param: { id: event.id },
        json: formData
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onSuccess: (data) => {
      showToast(data.message);
      handleEventStopEditing();
    },
    onError: (message: Error["message"]) => {
      showToast(message, true);
    },
    queryKeys: ["event-list"]
  });

  async function onSubmit(data: EventFormType) {
    await mutate(data);
  }
</script>

<EventForm {eventData} {defaultValues} {onSubmit} isMutationPending={$isPending} />
