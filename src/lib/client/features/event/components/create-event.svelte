<script lang="ts">
  import { addMinutes, format } from "date-fns";

  import { toggleModal } from "$lib/client/components/utils";
  import { eventCreateModalId } from "$lib/client/stores/event";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { EventForm as EventFormType } from "$lib/shared/types";

  import { EventForm } from ".";

  let errorMessage = $state("");
  let isErrorMessage = $derived(errorMessage !== "");

  const now = new Date();

  const defaultValues: EventFormType = {
    calendarId: "",
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    colorId: "",
    startDate: format(now, "yyyy-MM-dd"),
    startTime: format(now, "HH:mm:ss"),
    endDate: format(now, "yyyy-MM-dd"),
    endTime: format(addMinutes(now, 30), "HH:mm:ss"),
    timezone: "",
    allDay: false,
    status: "confirmed"
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: EventFormType) => {
      const res = await client.api.event.create.$post({ json: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";

      showToast(data.message);
      toggleModal(eventCreateModalId);
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

{#if isErrorMessage}
  <p class="text-sm text-error my-1">{errorMessage}</p>
{/if}

<EventForm {defaultValues} {onSubmit} isMutationPending={$isPending} isCreate />
