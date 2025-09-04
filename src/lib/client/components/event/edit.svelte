<script lang="ts">
  import { eventModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Event, EventForm as EventFormType } from "$lib/shared/types";

  import { Form } from ".";

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
    color: event.color,
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
      eventModalStore.activeItem.set(data.data);

      showToast(data.message);
      eventModalStore.stopEditing();
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["events"]
  });

  async function onSubmit(data: EventFormType) {
    await mutate(data);
  }
</script>

<Form {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage />
