<script lang="ts">
  import { PanelRight } from "@lucide/svelte";

  import { mainSidebarId, sidebars, toggleSidebar } from "$lib/stores/sidebar";

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
</script>

{#if !mainSidebarOpen}
  <button
    class="hidden lg:block btn btn-ghost btn-square"
    onclick={() => toggleSidebar(mainSidebarId)}
  >
    <PanelRight size="20px" />
  </button>
{/if}

<button
  class="lg:hidden btn btn-ghost btn-square"
  onclick={() => toggleSidebar(mainSidebarId)}
>
  <PanelRight size="20px" />
</button>
