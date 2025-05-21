<script lang="ts">
  import { Sidebar } from "$lib/components";
  import { toggleSidebar } from "$lib/stores/sidebar";
  import { sidebars } from "$lib/stores/sidebar";

  let mainSidebarId = "main-side-bar";
  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);

  let chatSidebarId = "chat-side-bar";
  let chatSidebarOpen = $derived($sidebars[chatSidebarId]);
</script>

<div class="relative min-h-screen">
  <!-- Left Sidebar -->
  <Sidebar sidebarId={mainSidebarId} className="w-[260px]  left-0" mainSidebar>
    Hello Main Sidebar
  </Sidebar>

  <!-- Main Content Area -->
  <div
    class={`transition-all duration-300 pl-4 pr-4 ${mainSidebarOpen ? "ml-[260px]" : "ml-0"} ${chatSidebarOpen ? "mr-[340px]" : "mr-0"}`}
  >
    <button class="btn" onclick={() => toggleSidebar(mainSidebarId)}>
      Toggle main sidebar
    </button>

    <button class="btn" onclick={() => toggleSidebar(chatSidebarId)}>
      Toggle chat sidebar
    </button>

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
  <Sidebar
    sidebarId={chatSidebarId}
    className="w-[340px] right-0"
    mainSidebar={false}
  >
    Hello Main Sidebar
  </Sidebar>
</div>
