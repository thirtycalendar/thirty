<script lang="ts">
  import { calView } from "$lib/client/stores/cal-view";

  import { BdModal } from "../../birthday/components";
  import { getBirthdays } from "../../birthday/query";
  import { EventModal } from "../../event/components";
  import { getEvents } from "../../event/query";
  import { HdCountryModal, HdModal } from "../../holiday/components";
  import { getHolidays } from "../../holiday/query";

  import { CalModal, DayCalendar, MonthCalendar, WeekCalendar, YearCalendar } from ".";

  let { data: events } = getEvents();
  let { data: birthdays } = getBirthdays();
  let { data: holidays } = getHolidays();
</script>

<div class="flex h-[calc(100vh-60px)] flex-col">
  {#if $events}
    {#if $calView === "year"}
      <YearCalendar />
    {:else if $calView === "month"}
      <MonthCalendar events={$events} birthdays={$birthdays} holidays={$holidays} />
    {:else if $calView === "day"}
      <DayCalendar events={$events} birthdays={$birthdays} holidays={$holidays} />
    {:else}
      <WeekCalendar events={$events} birthdays={$birthdays} holidays={$holidays} />
    {/if}
  {:else}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {/if}
</div>

<CalModal />
<EventModal />
<BdModal />
<HdCountryModal />
<HdModal />
