<script lang="ts">
  import { ChevronDown } from "@lucide/svelte";

  import { calView, handleCalViewChange } from "$lib/client/stores/cal-view";

  import type { CalView } from "$lib/shared/types";

  let views: CalView[] = ["year", "month", "week", "day"];
</script>

<div class="tabs tabs-sm tabs-box bg-base-300 hidden lg:block">
  {#each views as view (view)}
    <input
      type="radio"
      name={view}
      aria-label={view[0].toUpperCase() + view.slice(1)}
      value={view}
      onclick={handleCalViewChange}
      class="tab focus:bg-primary px-3 text-sm"
      class:bg-primary={$calView === view}
      checked={$calView === view}
    />
  {/each}
</div>

<div class="dropdown dropdown-end lg:hidden">
  <button tabindex="0" class="btn btn-sm sm:btn-md btn-secondary flex items-center">
    {$calView && $calView[0].toUpperCase() + $calView.slice(1)}
    <ChevronDown size="16" />
  </button>
  <ul class="dropdown-content menu bg-base-100 rounded-box border-base-200 z-1 mt-1 w-auto border">
    {#each views as view (view)}
      <input
        type="radio"
        name={view}
        aria-label={view[0].toUpperCase() + view.slice(1)}
        onclick={(e) => {
          (document.activeElement as HTMLElement)?.blur();
          handleCalViewChange(e);
        }}
        class="tab flex w-full items-center justify-start"
        checked={$calView === view}
      />
    {/each}
  </ul>
</div>
