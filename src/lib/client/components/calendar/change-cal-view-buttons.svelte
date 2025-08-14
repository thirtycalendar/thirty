<script lang="ts">
  import { calView, handleCalViewChange } from "$lib/client/stores/cal-view";

  import { CalViews } from "$lib/shared/constants";

  import { ChevronDown } from "../icons";

  let views = CalViews;
</script>

<div class="dropdown dropdown-end">
  <button
    tabindex="0"
    class="btn btn-sm sm:btn-md btn-primary border-base-300 flex items-center border"
  >
    <span>
      {$calView && $calView[0].toUpperCase() + $calView.slice(1)}
    </span>
    <ChevronDown size="23" strokeWidth="1.2" />
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
        class="tab flex w-full items-center justify-start text-base sm:text-lg"
        checked={$calView === view}
      />
    {/each}
  </ul>
</div>
