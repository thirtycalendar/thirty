<script lang="ts">
  import { Sidebar } from "$lib/components";
  import { toggleSidebar } from "$lib/stores/sidebar";

  const mainSidebarId = "main-side-bar";
</script>

<button class="btn" onclick={() => toggleSidebar(mainSidebarId)}>
  Toggle main sidebar
</button>

<div class="flex max-h-screen overflow-y-scroll">
  <!-- Left Sidebar -->
  <Sidebar sidebarId={mainSidebarId}>Hello</Sidebar>

  <!-- Main Content Area -->
  <div class="flex-1 overflow-y-auto p-4">
    <div class="grid grid-cols-8 gap-2">
      <div class="border"></div>
      <div class="border"></div>
      <div class="border"></div>
      <div class="border"></div>
      <div class="border"></div>
      <div class="border"></div>
      <div class="border"></div>
      <div class="border"></div>
    </div>
  </div>

  <!-- Right Sidebar -->
  <div class="w-[340px] shrink-0 bg-base-200 p-4">Right Sidebar</div>
</div>
