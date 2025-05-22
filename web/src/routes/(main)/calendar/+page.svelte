<script lang="ts">
  import { Sidebar } from "$lib/components";
  import {
    Calendar,
    CalSidebar,
    Navbar,
  } from "$lib/features/calendar/components";
  import { chatSidebarId, mainSidebarId, sidebars } from "$lib/stores/sidebar";

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
  let chatSidebarOpen = $derived($sidebars[chatSidebarId]);
</script>

<div
  class={`transition-all duration-300 ${chatSidebarOpen ? "mr-[340px]" : "mr-0"}`}
>
  <Navbar />

  <Calendar />
</div>

<Sidebar
  sidebarId={chatSidebarId}
  className="w-[340px] right-0"
  mainSidebar={false}
>
  Chat Sidebar
</Sidebar>
