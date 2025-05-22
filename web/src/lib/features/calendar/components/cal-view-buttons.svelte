<script lang="ts">
  import { MessageSquare } from "@lucide/svelte";

  import {
    calView,
    handleCalViewChange,
    type CalView,
  } from "$lib/stores/cal-view";
  import { toggleSidebar } from "$lib/stores/sidebar";

  let views: CalView[] = ["year", "month", "week", "day"];
</script>

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
