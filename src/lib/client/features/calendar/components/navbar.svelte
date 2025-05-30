<script lang="ts">
  import { MessageSquare } from "@lucide/svelte";

  import { ChangeCalViewButtons, ChangeDateButtons, CreateButton } from ".";

  import { ToggleSidebarIcon } from "$lib/client/components";
  import { calView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import { isHideChatIcon } from "$lib/client/stores/responsive";
  import { chatSidebarId, toggleSidebar } from "$lib/client/stores/sidebar";

  const month = $derived(new Intl.DateTimeFormat("en-US", { month: "short" }).format($currentDate));
  const year = $derived(new Intl.DateTimeFormat("en-US", { year: "numeric" }).format($currentDate));
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-1">
    <ToggleSidebarIcon />

    <div>
      <p class="sm:text-lg font-semibold flex gap-1">
        {#if $calView === "year"}
          {year}
        {:else}
          {month} <span class="hidden sm:flex">{year}</span>
        {/if}
      </p>
    </div>

    <ChangeDateButtons />
  </div>

  <div class="flex items-center gap-2">
    <CreateButton />

    <ChangeCalViewButtons />

    {#if $isHideChatIcon}
      <button class="btn btn-ghost btn-square" onclick={() => toggleSidebar(chatSidebarId)}>
        <MessageSquare size="20px" />
      </button>
    {/if}
  </div>
</div>
