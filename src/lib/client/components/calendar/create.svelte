<script lang="ts">
  import { calendarModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { getRandomColor } from "$lib/shared/utils/colors";
  import { getValidTimeZone } from "$lib/shared/utils/timezone";
  import type { CalendarForm as CalendarFormType } from "$lib/shared/types";

  import { toggleDraggableModal } from "../utils";

  import { Form } from ".";

  let errorMessage = $state("");

  const defaultValues: CalendarFormType = {
    externalId: null,
    source: "local",
    name: "",
    color: getRandomColor(),
    isPrimary: false,
    timezone: getValidTimeZone()
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: CalendarFormType) => {
      const res = await client.api.calendar.create.$post({ json: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: (data) => {
      errorMessage = "";
      defaultValues.color = getRandomColor();

      showToast(data.message);
      toggleDraggableModal(calendarModalStore.modalId);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["calendars", "events"]
  });

  async function onSubmit(data: CalendarFormType) {
    await mutate(data);
  }
</script>

<Form {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
