<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";

  import { SidebarItems as CalendarSidebarItems } from "$lib/client/components/calendar";
  import { mainSidebarState } from "$lib/client/stores/sidebar";
  import { initUserSession } from "$lib/client/stores/user-session";
  import { cn } from "$lib/client/utils/cn";

  let { children } = $props();

  const isOpen = $derived(mainSidebarState());
  let pathSegment = $derived(page.url.pathname.split("/").filter(Boolean)[0]);

  onMount(async () => {
    await initUserSession();
  });
</script>

<div class="bg-base-200 flex w-full">
  <!-- Sidebar -->
  <div
    class={cn(
      "bg-base-200 min-h-screen overflow-y-auto transition-all duration-300",
      $isOpen ? "w-[255px] p-2 pt-3" : "w-0"
    )}
  >
    <div class={cn("transition-opacity duration-200", $isOpen ? "opacity-100" : "opacity-0")}>
      {#if pathSegment === "calendar"}
        <CalendarSidebarItems />
      {/if}
    </div>
  </div>

  <!-- Container -->
  <div
    class={cn(
      "bg-base-100 my-2 h-[calc(100vh-16px)] flex-1 overflow-hidden p-3 shadow-md",
      $isOpen ? "ml-0 rounded-l-xl" : "m-2 rounded-xl"
    )}
  >
    {@render children?.()}
  </div>
</div>
