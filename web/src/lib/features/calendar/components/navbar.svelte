<script lang="ts">
  import { MessageSquare, PanelRight, Plus } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import { chatSidebarId, toggleSidebar } from "$lib/stores/sidebar";
  import { currentDate } from "$lib/stores/change-date";
  import { isHideChatIcon, isSm } from "$lib/stores/responsive";
  import { ToggleSidebarIcon } from "$lib/components";

  import { ChangeCalViewButtons, ChangeDateButtons } from ".";

  const month = $derived(
    new Intl.DateTimeFormat("en-US", { month: "short" }).format($currentDate),
  );
  const year = $derived(
    new Intl.DateTimeFormat("en-US", { year: "numeric" }).format($currentDate),
  );
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
    <!-- <div class={`dropdown ${!$isSm && "dropdown-top"} dropdown-end`}> -->
    <div
      class="z-100 absolute right-8 bottom-8 sm:static sm:right-0 sm:bottom-0 dropdown dropdown-top sm:dropdown-bottom dropdown-end"
    >
      <button
        class="btn btn-md bg-base-200 sm:bg-primary shadow-sm shadow-base-300 sm:shadow-none"
      >
        <Plus size="20px" /> <span class="hidden lg:block">Create</span>
      </button>
      <ul
        class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 my-1 p-2 shadow-md"
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

    <ChangeCalViewButtons />

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
