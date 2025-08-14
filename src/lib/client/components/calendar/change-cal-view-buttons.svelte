<script lang="ts">
  import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

  import { calView, handleCalViewChange } from "$lib/client/stores/cal-view";
  import { cn } from "$lib/client/utils/cn";

  import { CalViews } from "$lib/shared/constants";

  import { Icon } from "../icons";

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
    <Icon icon={ArrowDown01Icon} />
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
        class={cn(
          "btn btn-sm sm:btn-md flex w-full items-center justify-start font-normal",
          $calView === view ? "btn-secondary" : "btn-ghost"
        )}
        checked={$calView === view}
      />
    {/each}
  </ul>
</div>
