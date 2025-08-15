<script lang="ts">
  import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

  import { currentCalView } from "$lib/client/stores/cal-view";
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

  import { Icon } from "../icons";

  const currentView = $derived($currentCalView);

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

{#if currentView !== null && currentView in navHandlers}
  <div class="w-full gap-1 text-center">
    <button
      class="btn btn-ghost btn-xs sm:btn-sm btn-square"
      onclick={navHandlers[currentView].prev}
    >
      <Icon icon={ArrowLeft01Icon} absoluteStrokeWidth />
    </button>

    <button class="btn btn-outline border-base-300 btn-xs sm:btn-sm" onclick={goToToday}>
      Today
    </button>

    <button
      class="btn btn-ghost btn-xs sm:btn-sm btn-square"
      onclick={navHandlers[currentView].next}
    >
      <Icon icon={ArrowRight01Icon} absoluteStrokeWidth />
    </button>
  </div>
{/if}
