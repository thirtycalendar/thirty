<script lang="ts">
  import { PanelLeft } from "@lucide/svelte";

  import { mainSidebarId, sidebars, toggleSidebar } from "$lib/client/stores/sidebar";

  interface Props {
    sidebarId?: string;
    showIconOnHide?: boolean;
    forceVisible?: boolean;
    class?: string;
    tooltip?: string;
  }

  let {
    sidebarId = mainSidebarId,
    showIconOnHide = true,
    forceVisible = false,
    class: extraClass = "",
    tooltip
  }: Props = $props();

  let sidebarOpen = $derived($sidebars[sidebarId]);
</script>

{#if forceVisible || (!sidebarOpen && showIconOnHide)}
  <div class={tooltip ? "tooltip tooltip-bottom" : ""} data-tip={tooltip}>
    <button
      class={`btn btn-ghost btn-square ${extraClass}`}
      onclick={() => toggleSidebar(sidebarId)}
    >
      <PanelLeft size="20px" />
    </button>
  </div>
{/if}
