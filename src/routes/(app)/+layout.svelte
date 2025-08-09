<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";

  import { CalSidebar } from "$lib/client/features/calendar/components";
  import { ChatSidebar } from "$lib/client/features/chat/components";
  import { SettingsSidebar } from "$lib/client/features/settings/components";
  import { Sidebar, SidebarMenu, Toast } from "$lib/client/components";
  import { mainSidebarId, sidebars } from "$lib/client/stores/sidebar";
  import { initUserSession } from "$lib/client/stores/user-session";

  let { children } = $props();

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
  let pathSegment = $derived("");

  onMount(async () => {
    await initUserSession();
  });

  $effect(() => {
    pathSegment = page.url.pathname.split("/").filter(Boolean)[0];
  });
</script>

<div class="max-h-screen overflow-y-scroll">
  <Toast />

  <div class="relative h-screen overflow-hidden">
    <Sidebar sidebarId={mainSidebarId} class="absolute left-0 z-200 w-[260px]" mainSidebar>
      <SidebarMenu />

      {#if pathSegment === "calendar"}
        <CalSidebar />
      {:else if pathSegment === "chat"}
        <ChatSidebar />
      {:else if pathSegment === "settings"}
        <SettingsSidebar />
      {/if}
    </Sidebar>

    <div
      class={`bg-base-200 max-h-screen min-h-screen overflow-hidden p-4 transition-all duration-300 ${mainSidebarOpen ? "xl:ml-[260px]" : ""}`}
    >
      {@render children()}
    </div>
  </div>
</div>
