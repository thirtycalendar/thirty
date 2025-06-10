<script lang="ts">
  import { DayCalendar, EventModal, MonthCalendar, TaskModal, WeekCalendar, YearCalendar } from ".";

  import { calView } from "$lib/client/stores/cal-view";
  import { createQuery } from "$lib/client/utils/query/create-query";
  import { client } from "$lib/client/utils/rpc";

  const { data } = createQuery({
    queryFn: async () => {
      const res = await client.api.google.event.getAll.$get();
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["cal-list"]
  });
</script>

<EventModal />
<TaskModal />

<div class="h-[calc(100vh-60px)] flex flex-col">
  {#if $data}
    {#if $calView === "year"}
      <YearCalendar />
    {:else if $calView === "month"}
      <MonthCalendar events={$data.events} utilEvents={$data.utilEvents} />
    {:else if $calView === "day"}
      <DayCalendar events={$data.events} utilEvents={$data.utilEvents} />
    {:else}
      <WeekCalendar events={$data.events} utilEvents={$data.utilEvents} />
    {/if}
  {:else}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {/if}
</div>
