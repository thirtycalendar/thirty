<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";

  import { CalSidebar } from "$lib/ui/features/calendar/components";
  import { SettingsSidebar } from "$lib/ui/features/settings/components";
  import { mainSidebarId, sidebars } from "$lib/ui/stores/sidebar";
  import { initUserSession } from "$lib/ui/stores/user-session";
  import { Sidebar, SidebarMenu } from "$lib/ui/components";

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
  <div class="relative h-screen overflow-hidden">
    <Sidebar sidebarId={mainSidebarId} className="w-[260px] left-0 absolute z-200" mainSidebar>
      <SidebarMenu />

      {#if pathSegment === "calendar"}
        <CalSidebar />
      {:else if pathSegment === "chat"}
        <p>Chat sidebar</p>
      {:else if pathSegment === "settings"}
        <SettingsSidebar />
      {/if}
    </Sidebar>

    <div
      class={`min-h-screen max-h-screen overflow-hidden bg-base-200 transition-all duration-300 p-4 ${mainSidebarOpen ? "xl:ml-[260px]" : ""}`}
    >
      {@render children()}
    </div>
  </div>
</div>
