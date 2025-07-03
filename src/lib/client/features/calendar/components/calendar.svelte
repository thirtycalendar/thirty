<script lang="ts">
  import { calView } from "$lib/client/stores/cal-view";

  import { EventModal } from "../../event/components";
  import { getEvents } from "../../event/query";

  import { CalModal, DayCalendar, MonthCalendar, WeekCalendar, YearCalendar } from ".";

  const { data: events } = getEvents();
</script>

<CalModal />
<EventModal />

<div class="h-[calc(100vh-60px)] flex flex-col">
  {#if $events}
    {#if $calView === "year"}
      <YearCalendar />
    {:else if $calView === "month"}
      <MonthCalendar events={$events} />
    {:else if $calView === "day"}
      <DayCalendar events={$events} />
    {:else}
      <WeekCalendar events={$events} />
    {/if}
  {:else}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {/if}
</div>
