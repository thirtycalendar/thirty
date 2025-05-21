<script lang="ts">
  import { calView } from "$lib/stores/cal-view";

  import { DayCalendar, WeekCalendar } from ".";
</script>

<div class="h-[calc(100vh-60px)] flex flex-col">
  {#if $calView === null}
    <p class="text-sm text-gray-400 p-4">Loading calendar view…</p>
  {:else if $calView === "year"}
    <p>Year</p>
  {:else if $calView === "month"}
    <p>Month</p>
  {:else if $calView === "day"}
    <DayCalendar />
  {:else}
    <WeekCalendar />
  {/if}
</div>
