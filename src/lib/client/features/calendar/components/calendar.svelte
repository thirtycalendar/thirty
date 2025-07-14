<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import { calView } from "$lib/client/stores/cal-view";

  import { BdModal } from "../../birthday/components";
  import { getBirthdays } from "../../birthday/query";
  import { EventModal } from "../../event/components";
  import { getEvents } from "../../event/query";
  import { HdCountryModal } from "../../holiday/components";

  import { CalModal, DayCalendar, MonthCalendar, WeekCalendar, YearCalendar } from ".";

  let { data: events } = getEvents();
  let { data: birthdays } = getBirthdays();

  let state = writable(false);

  onMount(() => {
    if (!$state) {
      console.log("Mounted...");
    }

    state.set(true);
  });
</script>

<CalModal />
<EventModal />
<BdModal />
<HdCountryModal />

<div class="h-[calc(100vh-60px)] flex flex-col">
  {#if $events}
    {#if $calView === "year"}
      <YearCalendar />
    {:else if $calView === "month"}
      <MonthCalendar events={$events} birthdays={$birthdays} />
    {:else if $calView === "day"}
      <DayCalendar events={$events} birthdays={$birthdays} />
    {:else}
      <WeekCalendar events={$events} birthdays={$birthdays} />
    {/if}
  {:else}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {/if}
</div>
