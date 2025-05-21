<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  import {
    goToNextDay,
    goToNextWeek,
    goToPreviousDay,
    goToPreviousWeek,
    goToToday,
  } from "$lib/stores/change-date";
  import { calView } from "$lib/stores/cal-view";

  const navHandlers = {
    year: {
      prev: goToPreviousWeek,
      next: goToNextWeek,
    },
    month: {
      prev: goToPreviousDay,
      next: goToNextDay,
    },
    week: {
      prev: goToPreviousWeek,
      next: goToNextWeek,
    },
    day: {
      prev: goToPreviousDay,
      next: goToNextDay,
    },
  } as const;
</script>

{#if $calView !== null && $calView in navHandlers}
  <button class="btn btn-sm btn-square" onclick={navHandlers[$calView].prev}>
    <ChevronLeft size="20px" />
  </button>

  <button class="btn btn-sm" onclick={goToToday}>Today</button>

  <button class="btn btn-sm btn-square" onclick={navHandlers[$calView].next}>
    <ChevronRight size="20px" />
  </button>
{/if}
