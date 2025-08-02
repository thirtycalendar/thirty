<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

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
  <div class="w-full gap-0 text-center">
    <button class="btn btn-ghost btn-xs sm:btn-sm btn-square" onclick={navHandlers[$calView].prev}>
      <ChevronLeft size="20px" />
    </button>

    <button class="btn btn-outline border-base-300 btn-xs sm:btn-sm" onclick={goToToday}>
      Today
    </button>

    <button class="btn btn-ghost btn-xs sm:btn-sm btn-square" onclick={navHandlers[$calView].next}>
      <ChevronRight size="20px" />
    </button>
  </div>
{/if}
