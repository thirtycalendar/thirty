<script lang="ts">
  import { Sidebar } from "$lib/components";
  import { Calendar, Navbar } from "$lib/features/calendar/components";
  import { sidebars } from "$lib/stores/sidebar";

  let mainSidebarId = "main-side-bar";
  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);

  let chatSidebarId = "chat-side-bar";
  let chatSidebarOpen = $derived($sidebars[chatSidebarId]);
</script>

<div class="relative h-screen">
  <Sidebar sidebarId={mainSidebarId} className="w-[260px] left-0" mainSidebar>
    Main Sidebar
  </Sidebar>

  <div
    class={`max-h-screen min-h-screen bg-base-200 transition-all duration-300 pl-4 pr-4 ${mainSidebarOpen ? "ml-[260px]" : "ml-0"} ${chatSidebarOpen ? "mr-[340px]" : "mr-0"}`}
  >
    <Navbar {mainSidebarId} {chatSidebarId} />

    <Calendar />
  </div>

  <Sidebar
    sidebarId={chatSidebarId}
    className="w-[340px] right-0"
    mainSidebar={false}
  >
    Chat Sidebar
  </Sidebar>
</div>
