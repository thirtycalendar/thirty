<script lang="ts">
  import { ChevronDown, MessageSquare } from "@lucide/svelte";
  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import { toggleSidebar } from "$lib/stores/sidebar";
  import { isLg } from "$lib/stores/responsive";

  let views: CalView[] = ["year", "month", "week", "day"];
</script>

{#if $isLg}
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
{:else}
  <div class=" dropdown dropdown-end">
    <button class="btn flex items-center">
      {$calView && $calView[0].toUpperCase() + $calView.slice(1)}
      <ChevronDown size="16" />
    </button>
    <ul
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-auto mt-1 shadow-md"
    >
      {#each views as view}
        <input
          type="radio"
          name={view}
          aria-label={view[0].toUpperCase() + view.slice(1)}
          onclick={(e) => {
            (document.activeElement as HTMLElement)?.blur();
            handleCalViewChange(e);
          }}
          class="tab w-full flex items-center justify-start"
          checked={$calView === view}
        />
      {/each}
    </ul>
  </div>
{/if}
