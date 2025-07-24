<script lang="ts">
  import { page } from "$app/state";

  import { Calendar, MessagesSquareIcon, PanelLeft, Settings } from "@lucide/svelte";

  import { mainSidebarId, toggleSidebar } from "$lib/client/stores/sidebar";

  const activePath = $derived(page.url.pathname);
</script>

<div class="flex items-center justify-between mb-2">
  <div class="flex items-center gap-1">
    <div class="tooltip tooltip-bottom" data-tip="Chat">
      <a
        href="/chat"
        class={`btn btn-square btn-ghost ${activePath.startsWith("/chat") ? "bg-base-200" : ""}`}
      >
        <MessagesSquareIcon size="20" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Calendar">
      <a
        href="/calendar"
        class={`btn btn-square btn-ghost ${
          activePath.startsWith("/calendar") ? "bg-base-200" : ""
        }`}
      >
        <Calendar size="20" />
      </a>
    </div>

    <div class="tooltip tooltip-bottom" data-tip="Settings">
      <a
        href="/settings"
        class={`btn btn-square btn-ghost ${
          activePath.startsWith("/settings") ? "bg-base-200" : ""
        }`}
      >
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
