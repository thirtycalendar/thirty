<script lang="ts">
  import { calView } from "$lib/client/stores/cal-view";
  import {
    goToNextDay,
    goToNextMonth,
    goToNextWeek,
    goToNextYear,
    goToPreviousDay,
    goToPreviousMonth,
    goToPreviousWeek,
    goToPreviousYear,
    goToToday
  } from "$lib/client/stores/change-date";

  import { ChevronLeft, ChevronRight } from "../icons";

  const navHandlers = {
    year: {
      prev: goToPreviousYear,
      next: goToNextYear
    },
    month: {
      prev: goToPreviousMonth,
      next: goToNextMonth
    },
    week: {
      prev: goToPreviousWeek,
      next: goToNextWeek
    },
    day: {
      prev: goToPreviousDay,
      next: goToNextDay
    }
  } as const;
</script>

{#if $calView !== null && $calView in navHandlers}
  <div class="w-full gap-1 text-center">
    <button class="btn btn-ghost btn-xs sm:btn-sm btn-square" onclick={navHandlers[$calView].prev}>
      <ChevronLeft size="20" />
    </button>

    <button class="btn btn-outline border-base-300 btn-xs sm:btn-sm" onclick={goToToday}>
      Today
    </button>

    <button class="btn btn-ghost btn-xs sm:btn-sm btn-square" onclick={navHandlers[$calView].next}>
      <ChevronRight size="20" />
    </button>
  </div>
{/if}
