<script lang="ts">
  import { currentCalendarDetails, handleCalendarStopEditing } from "$lib/client/stores/calendar";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import type { Calendar, CalendarForm as CalendarFormType } from "$lib/shared/types";

  import { CalForm } from ".";

  interface EditCalendarProps {
    calendar: Calendar;
  }

  let { calendar }: EditCalendarProps = $props();

  let errorMessage = $state("");

  const defaultValues: CalendarFormType = {
    externalId: calendar.externalId,
    source: calendar.source,
    name: calendar.name,
    colorId: calendar.colorId,
    isPrimary: calendar.isPrimary,
    timezone: calendar.timezone
  };

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: CalendarFormType) => {
      const res = await client.api.calendar.update[":id"].$put({
        param: { id: calendar.id },
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
      currentCalendarDetails.set(data.data);

      showToast(data.message);
      handleCalendarStopEditing();
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

<CalForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage />
