<script lang="ts">
  import { Seo } from "$lib/client/components";
  import { Navbar, WeekCalendar, YearCalendar } from "$lib/client/components/calendar";
  import { birthdaysQuery, eventsQuery, userHolidaysQuery } from "$lib/client/data/queries";
  import { currentCalendarView } from "$lib/client/stores/calendar-view";

  let { data } = $props();

  const { data: events } = eventsQuery();
  const { data: birthdays } = birthdaysQuery();
  const { data: holidays } = userHolidaysQuery();
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
