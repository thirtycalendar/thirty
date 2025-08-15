<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";

  import { SidebarItems as CalendarSidebarItems } from "$lib/client/components/calendar";
  import { mainSidebarState, toggleMainSidebar } from "$lib/client/stores/sidebar";
  import { initUserSession } from "$lib/client/stores/user-session";
  import { cn } from "$lib/client/utils/cn";

  let { children } = $props();

  const isOpen = $derived(mainSidebarState());
  let pathSegment = $derived(page.url.pathname.split("/").filter(Boolean)[0]);

  onMount(initUserSession);
</script>

<div class="bg-base-200 flex w-full">
  <!-- Sidebar / Drawer -->
  <div
    class={cn(
      "bg-base-200 z-40 min-h-screen overflow-y-auto transition-all duration-300",
      "fixed top-0 left-0 h-full w-[255px] p-2 pt-3 sm:static",
      $isOpen ? "translate-x-0" : "-translate-x-full sm:w-0 sm:p-0"
    )}
  >
    {#if pathSegment === "calendar"}
      <CalendarSidebarItems />
    {/if}
  </div>

  <!-- Backdrop for mobile -->
  {#if $isOpen}
    <button
      class="fixed inset-0 z-30 bg-black/40 sm:hidden"
      onclick={toggleMainSidebar}
      aria-label="backdrop"
    ></button>
  {/if}

  <!-- Main content -->
  <div
    class={cn(
      "bg-base-100 m-2 h-[calc(100vh-16px)] flex-1 overflow-hidden rounded-xl p-3 shadow-md"
    )}
  >
    {@render children?.()}
  </div>
</div>
