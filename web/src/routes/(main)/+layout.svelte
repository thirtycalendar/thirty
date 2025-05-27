<script lang="ts">
  import { page } from "$app/state";

  import { CalSidebar } from "$lib/features/calendar/components";
  import { SettingsSidebar } from "$lib/features/settings/components";
  import { mainSidebarId, sidebars } from "$lib/stores/sidebar";
  import { Sidebar, SidebarMenu } from "$lib/components";

  let { children } = $props();

  let mainSidebarOpen = $derived($sidebars[mainSidebarId]);
  let pathSegment = $derived("");

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
