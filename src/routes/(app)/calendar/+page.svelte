<script lang="ts">
  import { Seo } from "$lib/client/components";
  import { Navbar, WeekCalendar } from "$lib/client/components/calendar";
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

<Navbar />

{#if $events}
  {#if $currentCalendarView === "year"}
    <!-- <YearCalendar /> -->
  {:else if $currentCalendarView === "month"}
    <!-- <MonthCalendar events={$events} birthdays={$birthdays} holidays={$holidays} /> -->
  {:else if $currentCalendarView === "day"}
    <!-- <DayCalendar events={$events} birthdays={$birthdays} holidays={$holidays} /> -->
  {:else}
    <WeekCalendar events={$events} birthdays={$birthdays} holidays={$holidays} />
  {/if}
{:else}
  <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
    <span class="loading loading-spinner loading-md"></span>
  </div>
{/if}
