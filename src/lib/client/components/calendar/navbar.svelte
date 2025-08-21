<script lang="ts">
  import { SidebarLeftIcon } from "@hugeicons/core-free-icons";

  import { currentCalendarView } from "$lib/client/stores/calendar-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import { toggleMainSidebar } from "$lib/client/stores/sidebar";

  import { ProfileButton } from "../auth";
  import { Icon } from "../icons";

  import { ChangeCalendarViewButtons, ChangeDateButtons, CreateButton } from ".";

  const month = $derived(new Intl.DateTimeFormat("en-US", { month: "short" }).format($currentDate));
  const year = $derived(new Intl.DateTimeFormat("en-US", { year: "numeric" }).format($currentDate));
</script>

<div class="mb-2 flex items-center justify-between text-xs">
  <div class="flex items-center gap-1">
    <button
      class="btn btn-ghost btn-square text-primary-content/70 hover:text-primary-content mx-2"
      onclick={toggleMainSidebar}
    >
      <Icon icon={SidebarLeftIcon} absoluteStrokeWidth />
    </button>

    <div>
      <p class="flex gap-1 text-base font-semibold sm:text-lg">
        {#if $currentCalendarView === "year"}
          {year}
        {:else}
          {month} <span class="font-normal">{year}</span>
        {/if}
      </p>
    </div>

    <ChangeDateButtons />
  </div>

  <div class="flex items-center gap-2">
    <CreateButton />

    <div class="hidden items-center gap-2 sm:flex">
      <ChangeCalendarViewButtons />

      <ProfileButton />
    </div>
  </div>
</div>
