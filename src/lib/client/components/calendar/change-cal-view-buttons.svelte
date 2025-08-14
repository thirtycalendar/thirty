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
    <Icon icon={ArrowDown01Icon} class="ml-2" />
  </button>

  <ul class="dropdown-content menu bg-base-100 rounded-box border-base-200 z-10 mt-1 w-auto border">
    {#each views as view (view)}
      <label
        class={cn(
          "btn btn-sm sm:btn-md flex w-full cursor-pointer items-center justify-start font-normal",
          $calView === view ? "btn-secondary" : "btn-ghost"
        )}
      >
        <input
          type="radio"
          name="calendar-view"
          class="hidden"
          value={view}
          checked={$calView === view}
          onchange={(e) => handleCalViewChange(e)}
        />
        {view[0].toUpperCase() + view.slice(1)}
      </label>
    {/each}
  </ul>
</div>
