<script lang="ts">
  import { Calendar, MessagesSquareIcon, PanelLeft, Settings } from "@lucide/svelte";

  import { mainSidebarId, toggleSidebar } from "$lib/ui/stores/sidebar";
</script>

<div class="flex items-center justify-between mb-2">
  <div class="flex items-center gap-1">
    <div class="tooltip tooltip-bottom" data-tip="Chat">
      <a href="/chat" class={`btn btn-square btn-ghost `}>
        <MessagesSquareIcon size="20" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Calendar">
      <a href="/calendar" class={`btn btn-square btn-ghost`}>
        <Calendar size="20" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Settings">
      <a href="/settings" class={`btn btn-square btn-ghost `}>
        <Settings size="20" />
      </a>
    </div>
  </div>

  <div>
    <div class="tooltip tooltip-bottom" data-tip="Hide">
      <button class="btn btn-square btn-ghost" onclick={() => toggleSidebar(mainSidebarId)}>
        <PanelLeft size="20" />
      </button>
    </div>
  </div>
</div>
