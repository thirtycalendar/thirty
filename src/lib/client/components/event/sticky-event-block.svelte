<script lang="ts">
  import { calendarsQuery } from "$lib/client/data/queries";
  import { eventModal } from "$lib/client/stores/modal";

  import type { Event } from "$lib/shared/types";

  interface Props {
    event: Event;
  }

  let { event }: Props = $props();

  const eventColor = $derived(event.color);

  const { data: calendars } = calendarsQuery();
  const calendarColor = $derived.by(() => {
    const color = $calendars?.find((cal) => cal.id === event.calendarId)?.color ?? "transparent";
    return color;
  });
</script>

<button
  class="text-primary-content border-primary-content/10 flex w-full cursor-pointer items-center gap-1.5 overflow-hidden rounded-xl border p-0 text-left shadow-sm backdrop-blur-md select-none"
  style:background-color="{eventColor}33"
  title={event.name}
  onclick={() => eventModal.handleModal(event)}
>
  <div class="h-full w-1 shrink-0" style:background-color={calendarColor}></div>
  <div class="w-full min-w-0 overflow-hidden p-0.5 text-xs font-medium">
    <p class="truncate">{event.name}</p>
  </div>
</button>
