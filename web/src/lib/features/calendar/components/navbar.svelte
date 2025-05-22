<script lang="ts">
  import { MessageSquare, PanelRight, Plus } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import { toggleSidebar } from "$lib/stores/sidebar";
  import { currentDate } from "$lib/stores/change-date";

  import { CalViewButtons, ChangeDateButtons } from ".";

  interface NavbarProps {
    mainSidebarId: string;
    chatSidebarId: string;
  }

  let { mainSidebarId, chatSidebarId }: NavbarProps = $props();

  const date = $derived(
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format($currentDate),
  );
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-2">
    <button class="btn btn-square" onclick={() => toggleSidebar(mainSidebarId)}>
      <PanelRight size="20px" />
    </button>

    <p class="text-lg font-semibold">{date}</p>

    <ChangeDateButtons />
  </div>

  <div class="flex items-center gap-3">
    <div class="dropdown dropdown-end">
      <button class="btn">
        <Plus size="20px" /> <span class="hidden lg:block">Create</span>
      </button>
      <ul
        class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 mt-1 p-2 shadow-md"
      >
        <li><button>Event</button></li>
        <li><button>Task</button></li>
      </ul>
    </div>

    <CalViewButtons />

    <button class="btn btn-square" onclick={() => toggleSidebar(chatSidebarId)}>
      <MessageSquare size="20px" />
    </button>
  </div>
</div>
