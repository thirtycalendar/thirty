<script lang="ts">
  import { ArrowLeft01Icon, ArrowRight01Icon, CircleIcon } from "@hugeicons/core-free-icons";

  import { currentCalendarView } from "$lib/client/stores/calendar-view";
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

  const currentView = $derived($currentCalendarView);

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
  <div class="text-primary-content/70 w-full gap-1 text-center">
    <button
      class="btn btn-ghost btn-sm sm:btn-md btn-square"
      onclick={navHandlers[currentView].prev}
    >
      <Icon icon={ArrowLeft01Icon} absoluteStrokeWidth />
    </button>

    <button
      class="btn btn-ghost btn-sm sm:btn-md btn-square tooltip tooltip-bottom font-normal"
      onclick={goToToday}
    >
      <Icon icon={CircleIcon} size={12} absoluteStrokeWidth />
    </button>

    <button
      class="btn btn-ghost btn-sm sm:btn-md btn-square"
      onclick={navHandlers[currentView].next}
    >
      <Icon icon={ArrowRight01Icon} absoluteStrokeWidth />
    </button>
  </div>
{/if}
