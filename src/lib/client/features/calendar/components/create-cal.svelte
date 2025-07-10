<script lang="ts">
  import { toggleModal } from "$lib/client/components/utils";
  import { calendarCreateModalId } from "$lib/client/stores/calendar";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { getRandomColorId } from "$lib/shared/utils/colors";
  import { getValidTimeZone } from "$lib/shared/utils/timezone";
  import type { CalendarForm as CalendarFormType } from "$lib/shared/types";

  import { CalForm } from ".";

  let errorMessage = $state("Error Message");

  const defaultValues: CalendarFormType = {
    externalId: null,
    source: "local",
    name: "",
    colorId: getRandomColorId(),
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
      defaultValues.colorId = getRandomColorId();

      showToast(data.message);
      toggleModal(calendarCreateModalId);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["cal-list", "event-list"]
  });

  async function onSubmit(data: CalendarFormType) {
    await mutate(data);
  }
</script>

<CalForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
