<script lang="ts">
  import { onMount } from "svelte";

  // import { page } from "$app/state";

  import { Toast } from "$lib/client/components";
  import { Modals as BirthdayModals } from "$lib/client/components/birthday";
  import {
    Modals as CalendarModals,
    SidebarItems as CalendarSidebarItems
  } from "$lib/client/components/calendar";
  import { Modal as ChatModal } from "$lib/client/components/chat";
  import { Modals as EventModals } from "$lib/client/components/event";
  import { Modals as HolidayModals } from "$lib/client/components/holiday";
  import { Modal as SettingsModal } from "$lib/client/components/settings";
  import { mainSidebarStore } from "$lib/client/stores/boolean-store";
  import { initUserSession } from "$lib/client/stores/user-session";
  import { cn } from "$lib/client/utils/cn";

  let { children } = $props();

  const { store: isOpen, toggle: toggleMainSidebar } = mainSidebarStore;
  // const pathSegment = $derived(page.url.pathname.split("/").filter(Boolean)[0]);

  onMount(initUserSession);
</script>

<Toast />

<ChatModal />
<CalendarModals />
<EventModals />
<BirthdayModals />
<HolidayModals />
<SettingsModal />

<div class="bg-base-200 flex h-screen w-full">
  <!-- Sidebar -->
  <div
    class={cn(
      "bg-base-200 z-9999 overflow-y-auto transition-all duration-300",
      "fixed top-0 left-0 h-full w-[255px] p-2 pt-3 sm:static sm:h-full",
      $isOpen ? "translate-x-0" : "-translate-x-full sm:w-0 sm:p-0"
    )}
  >
    <!-- {#if pathSegment === "calendar"} -->
    <CalendarSidebarItems />
    <!-- {/if} -->
  </div>

  <!-- Backdrop -->
  {#if $isOpen}
    <button
      class="fixed inset-0 z-30 bg-black/40 sm:hidden"
      onclick={toggleMainSidebar}
      aria-label="backdrop"
    ></button>
  {/if}

  <!-- Main -->
  <div class="bg-base-100 m-2 flex flex-1 flex-col overflow-hidden rounded-xl p-3 shadow-md">
    {@render children()}
  </div>
</div>
