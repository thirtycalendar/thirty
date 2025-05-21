<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";

  const views: CalView[] = ["month", "week", "day"];
</script>

<div class="flex justify-between items-center py-3">
  <div>
    <p>May 21, 2025</p>
  </div>

  <div class="tabs tabs-box bg-base-300">
    {#each views as view}
      <input
        type="radio"
        name={view}
        aria-label={view[0].toUpperCase() + view.slice(1)}
        onclick={handleCalViewChange}
        class="tab"
        checked={$calView === view}
      />
    {/each}
  </div>

  <div>
    <button>
      <ChevronLeft size="25px" />
    </button>

    <button>Today</button>

    <button>
      <ChevronRight size="25px" />
    </button>
  </div>
</div>
