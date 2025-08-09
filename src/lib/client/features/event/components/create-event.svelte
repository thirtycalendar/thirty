<script lang="ts">
  import { addMinutes, format } from "date-fns";

  import { toggleModal } from "$lib/client/components/utils";
  import { eventModal } from "$lib/client/stores/modal";
  import { showToast } from "$lib/client/stores/toast";
  import { createMutation } from "$lib/client/utils/query/create-mutation";
  import { client } from "$lib/client/utils/rpc";

  import { getRandomColor } from "$lib/shared/utils/colors";
  import type { EventForm as EventFormType } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";

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
    color: getRandomColor(),
    startDate: format(now, "yyyy-MM-dd"),
    startTime: format(now, "HH:mm:ss"),
    endDate: format(now, "yyyy-MM-dd"),
    endTime: format(addMinutes(now, 30), "HH:mm:ss"),
    timezone: "",
    allDay: false,
    status: "confirmed"
  };

  const { data: calendars } = getCalendars();

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
      toggleModal(eventModal.modalId);
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

<EventForm {defaultValues} {onSubmit} isMutationPending={$isPending} bind:errorMessage isCreate />
