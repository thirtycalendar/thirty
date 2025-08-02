<script lang="ts">
  import { page } from "$app/state";

  import { Calendar, MessagesSquareIcon, Settings } from "@lucide/svelte";

  import { ToggleSidebarIcon } from ".";

  const activePath = $derived(page.url.pathname);
</script>

<div class="mb-2 flex items-center justify-between">
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

  <ToggleSidebarIcon tooltip="Hide" forceVisible={true} />
</div>
