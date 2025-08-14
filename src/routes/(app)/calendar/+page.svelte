<script lang="ts">
  import { Seo } from "$lib/client/components";
  import { Navbar, SidebarItems } from "$lib/client/components/calendar";
  import { mainSidebarState } from "$lib/client/stores/sidebar";
  import { cn } from "$lib/client/utils/cn";

  let { data } = $props();

  const isOpen = $derived(mainSidebarState());
</script>

<Seo seo={data.seo} />

<div class="flex w-full">
  <!-- Sidebar -->
  <div
    class={cn(
      "bg-base-200 min-h-screen overflow-y-auto transition-all duration-300",
      $isOpen ? "w-[255px] p-2 pt-3" : "w-0"
    )}
  >
    <div class={cn("transition-opacity duration-200", $isOpen ? "opacity-100" : "opacity-0")}>
      <SidebarItems />
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
