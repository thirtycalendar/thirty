<script lang="ts">
  import { MessageSquare, PanelRight } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import { toggleSidebar } from "$lib/stores/sidebar";
  import { currentDate } from "$lib/stores/change-date";

  import { ChangeDateButtons } from ".";

  interface NavbarProps {
    mainSidebarId: string;
    chatSidebarId: string;
  }

  let { mainSidebarId, chatSidebarId }: NavbarProps = $props();

  let views: CalView[] = ["year", "month", "week", "day"];

  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format($currentDate);
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-2">
    <button class="btn btn-square" onclick={() => toggleSidebar(mainSidebarId)}>
      <PanelRight size="20px" />
    </button>

    <p class="text-lg font-semibold">{date}</p>

    <ChangeDateButtons />
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
