<script lang="ts">
  import { addMinutes, format } from "date-fns";

  import { toggleModal } from "$lib/client/components/utils";
  import { eventModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { EventForm as EventFormType } from "$lib/shared/types";

  import { EventForm } from ".";

  let errorMessage = $state("");

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
      toggleModal(eventModal.modalId);
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

<EventForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
