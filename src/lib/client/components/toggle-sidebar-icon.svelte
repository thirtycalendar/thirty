<script lang="ts">
  import { PanelLeft } from "@lucide/svelte";

  import { mainSidebarId, sidebars, toggleSidebar } from "$lib/client/stores/sidebar";

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
</script>

{#if !mainSidebarOpen}
  <button
    class="btn btn-ghost btn-square hidden lg:flex"
    onclick={() => toggleSidebar(mainSidebarId)}
  >
    <PanelLeft size="20px" />
  </button>
{/if}

<button class="btn btn-ghost btn-square lg:hidden" onclick={() => toggleSidebar(mainSidebarId)}>
  <PanelLeft size="20px" />
</button>
