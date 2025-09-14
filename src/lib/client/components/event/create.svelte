<script lang="ts">
  import { addMinutes, format } from "date-fns";

  import { toggleDraggableModal } from "$lib/client/components/utils";
  import { calendarsQuery } from "$lib/client/data/queries";
  import { eventModalStore } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { getRandomColor } from "$lib/shared/utils/colors";
  import type { EventForm } from "$lib/shared/types";

  import { draggedEventEnd, draggedEventStart } from "./utils";

  import { Form } from ".";

  let errorMessage = $state("");

  const now = new Date();

  let defaultValues: EventForm = $derived({
    calendarId: "",
    externalId: null,
    source: "local",
    name: "",
    description: null,
    location: null,
    color: getRandomColor(),
    startDate: format($draggedEventStart ? $draggedEventStart : now, "yyyy-MM-dd"),
    startTime: format($draggedEventStart ? $draggedEventStart : now, "HH:mm:ss"),
    endDate: format($draggedEventEnd ? $draggedEventEnd : now, "yyyy-MM-dd"),
    endTime: format($draggedEventEnd ? $draggedEventEnd : addMinutes(now, 30), "HH:mm:ss"),
    timezone: "",
    allDay: false,
    status: "confirmed"
  });

  const { data: calendars } = calendarsQuery();

  let { mutate, isPending } = createMutation({
    mutationFn: async (formData: EventForm) => {
      const res = await client.api.event.create.$post({ json: formData });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      return data;
    },
    onMutate: () => {
      errorMessage = "";
    },
    onSuccess: async (data) => {
      errorMessage = "";

      if ($calendars) {
        const primaryCalendar = $calendars.find((cal) => cal.isPrimary);
        const fallbackCalendar = primaryCalendar ?? $calendars[0];

        if (fallbackCalendar) {
          defaultValues.calendarId = fallbackCalendar.id;
          defaultValues.color = fallbackCalendar.color;
          defaultValues.timezone = fallbackCalendar.timezone;
        }
      }

      showToast(data.message);
      toggleDraggableModal(eventModalStore.modalId);
    },
    onError: (message: Error["message"]) => {
      errorMessage = message;
    },
    queryKeys: ["events"]
  });

  async function onSubmit(data: EventForm) {
    await mutate(data);
  }
</script>

<Form {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
