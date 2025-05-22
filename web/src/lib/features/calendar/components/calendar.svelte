<script lang="ts">
  import { calView } from "$lib/stores/cal-view";

  import { DayCalendar, MonthCalendar, WeekCalendar, YearCalendar } from ".";
</script>

<div class="h-[calc(100vh-60px)] flex flex-col">
  {#if $calView === null}
    <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  {:else if $calView === "year"}
    <YearCalendar />
  {:else if $calView === "month"}
    <MonthCalendar />
  {:else if $calView === "day"}
    <DayCalendar />
  {:else}
    <WeekCalendar />
  {/if}
</div>
