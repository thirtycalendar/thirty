<script lang="ts">
  import { toggleModal } from "$lib/client/components/utils";
  import { calendarCreateModalId } from "$lib/client/stores/calendar";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { CalendarForm as CalendarFormType } from "$lib/types";
  import { getRandomColorId } from "$lib/utils/colors";
  import { getValidTimeZone } from "$lib/utils/timezone";

  import { CalForm } from ".";

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
    onSuccess: (data) => {
      showToast(data.message);
      toggleModal(calendarCreateModalId);
    },
    onError: (message: Error["message"]) => {
      showToast(message, true);
    },
    queryKeys: ["cal-list", "event-list"]
  });

  async function onSubmit(data: CalendarFormType) {
    await mutate(data);
  }
</script>

<CalForm {defaultValues} {onSubmit} isMutationPending={$isPending} isCreate />
