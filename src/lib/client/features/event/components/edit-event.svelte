<script lang="ts">
  import { writable, type Writable } from "svelte/store";

  import { format, parseISO } from "date-fns";

  import { currentEventDetails, handleEventStopEditing } from "$lib/client/stores/event";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Event, EventDataType, EventForm as EventFormType } from "$lib/shared/types";

  import { EventForm } from ".";

  interface EditEventProps {
    event: Event;
  }

  let { event }: EditEventProps = $props();

  const defaultValues: EventFormType = {
    calendarId: event.calendarId,
    externalId: event.externalId,
    source: event.source,
    name: event.name,
    description: event.description,
    location: event.location,
    colorId: event.colorId,
    startDate: event.startDate,
    startTime: event.startTime,
    endDate: event.endDate,
    endTime: event.endTime,
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
      currentEventDetails.set(data.data);

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

<EventForm {defaultValues} {onSubmit} isMutationPending={$isPending} />
