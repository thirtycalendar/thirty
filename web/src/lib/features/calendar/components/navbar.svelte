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

  interface NavbarProps {
    mainSidebarId: string;
    chatSidebarId: string;
  }

  let { mainSidebarId, chatSidebarId }: NavbarProps = $props();

  let views: CalView[] = ["month", "week", "day"];
</script>

<div class="flex justify-between items-center py-3">
  <div class="flex items-center gap-2">
    <button class="btn btn-square" onclick={() => toggleSidebar(mainSidebarId)}>
      <PanelRight size="20px" />
    </button>

    <p class="text-lg font-semibold">May 21, 2025</p>

    <div>
      <button class="btn btn-sm btn-square">
        <ChevronLeft size="20px" />
      </button>

      <button class="btn btn-sm">Today</button>

      <button class="btn btn-sm btn-square">
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
