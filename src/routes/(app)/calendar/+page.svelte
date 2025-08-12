<script lang="ts">
  import { Navbar } from "$lib/client/components/calendar";
  import { mainSidebarId, sidebarState } from "$lib/client/stores/sidebar";
  import { cn } from "$lib/client/utils/cn";

  const isOpen = $derived(sidebarState(mainSidebarId));
</script>

<div class="flex">
  <!-- Sidebar -->
  <div class={cn(!$isOpen && "hidden")}>Sidebar</div>

  <!-- Calendar -->
  <div
    class={cn(
      "bg-base-100 my-2 h-[calc(100vh-16px)] w-full overflow-hidden p-3 shadow-md transition-all duration-300",
      $isOpen ? "ml-[220px] rounded-l-xl" : "m-2 rounded-xl"
    )}
  >
    <Navbar />

    Calendar
  </div>
</div>
