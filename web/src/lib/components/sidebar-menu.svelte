<script lang="ts">
  import { mainSidebarId, toggleSidebar } from "$lib/stores/sidebar";
  import {
    Calendar,
    MessagesSquareIcon,
    PanelRight,
    Settings,
  } from "@lucide/svelte";
</script>

<div class="flex items-center justify-between mb-2">
  <div>
    <div class="tooltip tooltip-bottom" data-tip="Hide">
      <button
        class="btn btn-square btn-ghost"
        onclick={() => toggleSidebar(mainSidebarId)}
      >
        <PanelRight size="20" />
      </button>
    </div>
  </div>

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
</div>
