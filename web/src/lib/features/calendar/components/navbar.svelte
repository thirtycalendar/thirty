<script lang="ts">
  import { MessageSquare, PanelRight, Plus } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import {
    chatSidebarId,
    mainSidebarId,
    sidebars,
    toggleSidebar,
  } from "$lib/stores/sidebar";
  import { currentDate } from "$lib/stores/change-date";
  import { isHideChatIcon, isLg, isSm } from "$lib/stores/responsive";

  import { CalViewButtons, ChangeDateButtons } from ".";

  const month = $derived(
    new Intl.DateTimeFormat("en-US", { month: "short" }).format($currentDate),
  );
  const year = $derived(
    new Intl.DateTimeFormat("en-US", { year: "numeric" }).format($currentDate),
  );

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
</script>

<div class="flex justify-between items-center">
  <div class="flex items-center gap-1">
    {#if !mainSidebarOpen}
      <button
        class="btn btn-ghost btn-square"
        onclick={() => toggleSidebar(mainSidebarId)}
      >
        <PanelRight size="20px" />
      </button>
    {/if}

    <div>
      <p class="text-lg font-semibold flex gap-1">
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
    <div class="dropdown dropdown-end">
      <button class="btn btn-sm sm:btn-md btn-primary">
        <Plus size="20px" /> <span class="hidden lg:block">Create</span>
      </button>
      <ul
        class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 mt-1 p-2 shadow-md"
      >
        <li>
          <button
            onclick={() => (document.activeElement as HTMLElement)?.blur()}
          >
            Event
          </button>
        </li>
        <li>
          <button
            onclick={() => (document.activeElement as HTMLElement)?.blur()}
          >
            Task
          </button>
        </li>
      </ul>
    </div>

    {#if $isSm}
      <CalViewButtons />
    {/if}

    {#if $isHideChatIcon}
      <button
        class="btn btn-ghost btn-square"
        onclick={() => toggleSidebar(chatSidebarId)}
      >
        <MessageSquare size="20px" />
      </button>
    {/if}
  </div>
</div>
