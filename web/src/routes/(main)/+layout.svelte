<script lang="ts">
  import { Sidebar, SidebarMenu } from "$lib/components";
  import { CalSidebar } from "$lib/features/calendar/components";
  import { mainSidebarId, sidebars } from "$lib/stores/sidebar";

  let { children } = $props();

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
</script>

<div class="max-h-screen overflow-y-scroll">
  <div class="relative h-screen">
    <Sidebar sidebarId={mainSidebarId} className="w-[260px] left-0" mainSidebar>
      <SidebarMenu />

      <CalSidebar />
    </Sidebar>

    {@render children()}
  </div>
</div>
