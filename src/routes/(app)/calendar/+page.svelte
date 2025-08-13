<script lang="ts">
  import { Navbar, SidebarCalendar } from "$lib/client/components/calendar";
  import { mainSidebarId, sidebarState } from "$lib/client/stores/sidebar";
  import { cn } from "$lib/client/utils/cn";

  const isOpen = $derived(sidebarState(mainSidebarId));
</script>

<div class="flex w-full">
  <!-- Sidebar -->
  <div
    class={cn(
      "bg-base-200 h-screen overflow-y-auto p-2 transition-all duration-300",
      $isOpen ? "w-[250px]" : "w-0"
    )}
  >
    <div class={cn("transition-opacity duration-200", $isOpen ? "opacity-100" : "opacity-0")}>
      <SidebarCalendar />
    </div>
  </div>

  <!-- Calendar container -->
  <div
    class={cn(
      "bg-base-100 my-2 h-[calc(100vh-16px)] flex-1 overflow-hidden p-3 shadow-md",
      $isOpen ? "ml-0 rounded-l-xl" : "m-2 rounded-xl"
    )}
  >
    <Navbar />

    Main calendar content
  </div>
</div>
