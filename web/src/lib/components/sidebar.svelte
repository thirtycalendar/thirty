<script lang="ts">
  import type { Snippet } from "svelte";
  import { PanelRight } from "@lucide/svelte";

  interface ModalProps {
    sidebarId: string;
    children: Snippet;
  }

  let { sidebarId, children }: ModalProps = $props();
</script>

<div class="drawer drawer-end sidebar-open z-5000">
  <input id={sidebarId} type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Sidebar icon -->
    <label for={sidebarId} class="drawer-button sidebar-open-icon">
      <PanelRight size="25" class="opacity-75" />
    </label>
  </div>
  <div class="drawer-side">
    <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <!-- Sidebar content here -->
      {@render children()}
    </div>
  </div>
</div>
