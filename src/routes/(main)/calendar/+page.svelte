<script lang="ts">
  import { Calendar, Navbar } from "$lib/ui/features/calendar/components";
  import { chatSidebarId, sidebars } from "$lib/ui/stores/sidebar";
  import { Sidebar } from "$lib/ui/components";

  let chatSidebarOpen = $derived($sidebars[chatSidebarId]);
</script>

<div class={`transition-all duration-300 ${chatSidebarOpen ? "mr-[340px]" : "mr-0"}`}>
  <Navbar />

  <Calendar />
</div>

<Sidebar sidebarId={chatSidebarId} className="w-[340px] right-0" mainSidebar={false}>
  Chat Sidebar
</Sidebar>
