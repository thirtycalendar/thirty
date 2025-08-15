<script lang="ts">
  import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

  import { currentCalView, setCalView } from "$lib/client/stores/cal-view";
  import { cn } from "$lib/client/utils/cn";

  import { CalViews } from "$lib/shared/constants";

  import { Icon } from "../icons";

  const currentView = $derived($currentCalView);
  const views = CalViews;
</script>

<div class="dropdown dropdown-end">
  <button
    tabindex="0"
    class="btn btn-sm sm:btn-md btn-primary border-base-300 flex items-center border"
  >
    <span>{currentView && currentView[0].toUpperCase() + currentView.slice(1)}</span>
    <Icon icon={ArrowDown01Icon} class="ml-2" />
  </button>

  <ul class="dropdown-content menu bg-base-100 rounded-box border-base-200 z-10 mt-1 w-auto border">
    {#each views as view (view)}
      <button
        type="button"
        class={cn(
          "btn btn-sm sm:btn-md flex w-full items-center justify-start font-normal",
          currentView === view ? "btn-secondary" : "btn-ghost"
        )}
        onclick={() => {
          setCalView(view);
          (document.activeElement as HTMLElement)?.blur();
        }}
      >
        {view[0].toUpperCase() + view.slice(1)}
      </button>
    {/each}
  </ul>
</div>
