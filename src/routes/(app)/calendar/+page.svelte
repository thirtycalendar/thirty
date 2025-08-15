<script lang="ts">
  import { Seo } from "$lib/client/components";
  import { Navbar, WeekCalendar, YearCalendar } from "$lib/client/components/calendar";
  import { getBirthdays } from "$lib/client/data/queries/birthday";
  import { getEvents } from "$lib/client/data/queries/event";
  import { getHolidays } from "$lib/client/data/queries/holiday";
  import { currentCalendarView } from "$lib/client/stores/calendar-view";

  let { data } = $props();

  let { data: events } = getEvents();
  let { data: birthdays } = getBirthdays();
  let { data: holidays } = getHolidays();
</script>

<Seo seo={data.seo} />

<div class="relative flex h-full flex-col">
  <Navbar />

  {#if $events}
    <div class="flex-1 overflow-y-scroll">
      {#if $currentCalendarView === "year"}
        <YearCalendar />
      {:else if $currentCalendarView === "month"}
        <!--  -->
      {:else if $currentCalendarView === "day"}
        <!--  -->
      {:else}
        <WeekCalendar events={$events} birthdays={$birthdays} holidays={$holidays} />
      {/if}
    </div>
  {:else}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {/if}
</div>
