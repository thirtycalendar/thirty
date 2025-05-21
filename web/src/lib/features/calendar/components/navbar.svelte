<script lang="ts">
  import {
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    PanelRight,
  } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import { toggleSidebar } from "$lib/stores/sidebar";
  import {
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
  } from "$lib/stores/week-date";

  interface NavbarProps {
    mainSidebarId: string;
    chatSidebarId: string;
  }

  let { mainSidebarId, chatSidebarId }: NavbarProps = $props();

  let views: CalView[] = ["year", "month", "week", "day"];

  let date = new Date();
  const currentDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-2">
    <button class="btn btn-square" onclick={() => toggleSidebar(mainSidebarId)}>
      <PanelRight size="20px" />
    </button>

    <p class="text-lg font-semibold">{currentDate}</p>

    <div>
      <button class="btn btn-sm btn-square" onclick={goToPreviousWeek}>
        <ChevronLeft size="20px" />
      </button>

      <button class="btn btn-sm" onclick={goToToday}>Today</button>

      <button class="btn btn-sm btn-square" onclick={goToNextWeek}>
        <ChevronRight size="20px" />
      </button>
    </div>
  </div>

  <div class="flex items-center gap-1">
    <div class="tabs tabs-sm tabs-box bg-base-300">
      {#each views as view}
        <input
          type="radio"
          name={view}
          aria-label={view[0].toUpperCase() + view.slice(1)}
          onclick={handleCalViewChange}
          class="tab px-3 text-sm"
          checked={$calView === view}
        />
      {/each}
    </div>

    <button
      class="ml-2 btn btn-square"
      onclick={() => toggleSidebar(chatSidebarId)}
    >
      <MessageSquare size="20px" />
    </button>
  </div>
</div>
