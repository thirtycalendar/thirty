<script lang="ts">
  import { Sidebar, SidebarMenu } from "$lib/components";
  import { CalSidebar } from "$lib/features/calendar/components";
  import { mainSidebarId, sidebars } from "$lib/stores/sidebar";

  let { children } = $props();

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
</script>

<div class="max-h-screen overflow-y-scroll">
  <div class="relative h-screen">
    <Sidebar
      sidebarId={mainSidebarId}
      className="w-[260px] left-0 lg:absolute"
      mainSidebar
    >
      <SidebarMenu />

      <CalSidebar />
    </Sidebar>

    <div
      class={`min-h-screen max-h-screen overflow-hidden bg-base-200 transition-all duration-300 p-4 ${mainSidebarOpen ? "lg:ml-[260px]" : "ml-0"}`}
    >
      {@render children()}
    </div>
  </div>
</div>
