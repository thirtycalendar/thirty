<script lang="ts">
  import { DayCalendar, MonthCalendar, WeekCalendar, YearCalendar } from ".";

  import { calView } from "$lib/client/stores/cal-view";

  import { EventModal } from "../../event/components";
  import { getEventList } from "../../event/query";
  import { TaskModal } from "../../task/components";

  const { eventList } = getEventList();
</script>

<EventModal />
<TaskModal />

<div class="h-[calc(100vh-60px)] flex flex-col">
  {#if $eventList}
    {#if $calView === "year"}
      <YearCalendar />
    {:else if $calView === "month"}
      <MonthCalendar events={$eventList} />
    {:else if $calView === "day"}
      <DayCalendar events={$eventList} />
    {:else}
      <WeekCalendar events={$eventList} />
    {/if}
  {:else}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {/if}
</div>
