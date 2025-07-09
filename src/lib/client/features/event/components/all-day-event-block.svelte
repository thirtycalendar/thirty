<script lang="ts">
  import { handleEventModal } from "$lib/client/stores/event";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Event } from "$lib/shared/types";

  import { getCalendars } from "../../calendar/query";

  interface Props {
    event: Event;
  }

  let { event }: Props = $props();

  const eventColor = $derived(getColorHexCodeFromId(event.colorId));

  const { data: calendars } = getCalendars();
  const calendarColor = $derived.by(() => {
    const colorId = $calendars?.find((cal) => cal.id === event.calendarId)?.colorId ?? "-1";
    return getColorHexCodeFromId(colorId);
  });
</script>

<button
  class="text-primary-content w-full cursor-pointer select-none overflow-hidden rounded-xl flex items-center gap-1.5 backdrop-blur-md border border-primary-content/10 shadow-sm p-0 text-left h-[26px]"
  style:background-color="{eventColor}33"
  title={event.name}
  onclick={() => handleEventModal(event)}
>
  <div class="w-1 h-full shrink-0" style:background-color={calendarColor}></div>
  <div class="px-1 py-0.5 overflow-hidden">
    <p class="text-xs font-semibold text-primary-content/90 truncate">{event.name}</p>
  </div>
</button>
