<script lang="ts">
  import { eventModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Event, EventForm as EventFormType } from "$lib/shared/types";

  import { EventForm } from ".";

  interface Props {
    event: Event;
  }

  let errorMessage = $state("");

  let { event }: Props = $props();

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
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";
      eventModal.currentDetails.set(data.data);

      showToast(data.message);
      eventModal.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["event-list"]
  });

  async function onSubmit(data: EventFormType) {
    await mutate(data);
  }
</script>

<EventForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage />
