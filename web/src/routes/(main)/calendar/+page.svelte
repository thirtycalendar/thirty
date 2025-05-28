<script lang="ts">
  import { Calendar, Navbar } from "$lib/features/calendar/components";
  import { chatSidebarId, sidebars } from "$lib/stores/sidebar";
  import { Sidebar } from "$lib/components";

  let chatSidebarOpen = $derived($sidebars[chatSidebarId]);
</script>

<div class={`transition-all duration-300 ${chatSidebarOpen ? "mr-[340px]" : "mr-0"}`}>
  <Navbar />

  <Calendar />
</div>

<Sidebar sidebarId={chatSidebarId} className="w-[340px] right-0" mainSidebar={false}>
  Chat Sidebar
</Sidebar>
