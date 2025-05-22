<script lang="ts">
  import { Sidebar } from "$lib/components";
  import {
    Calendar,
    CalSidebar,
    Navbar,
  } from "$lib/features/calendar/components";
  import { mainSidebarId, sidebars } from "$lib/stores/sidebar";

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
</script>

<div
  class={`min-h-screen max-h-screen overflow-hidden bg-base-200 transition-all duration-300 p-4 ${mainSidebarOpen ? "ml-[260px]" : "ml-0"}`}
>
  Settings
</div>
