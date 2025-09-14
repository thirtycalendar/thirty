<script lang="ts">
  import { Search01Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons";

  import { mainSidebarStore } from "$lib/client/stores/boolean-store";
  import { currentCalendarView } from "$lib/client/stores/calendar-view";
  import { currentDate } from "$lib/client/stores/change-date";

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
      onclick={mainSidebarStore.toggle}
    >
      <Icon icon={SidebarLeftIcon} absoluteStrokeWidth />
    </button>

    <div>
      <p class="flex gap-1 text-base font-semibold sm:text-lg">
        {#if $currentCalendarView === "year"}
          {year}
        {:else}
          {month} <span class="hidden font-normal sm:block">{year}</span>
        {/if}
      </p>
    </div>

    <ChangeDateButtons />
  </div>

  <div class="flex items-center gap-2">
    <button
      class="btn btn-ghost btn-square btn-sm sm:btn-md text-primary-content/70 hover:text-primary-content ml-2"
    >
      <Icon icon={Search01Icon} class="size-4 sm:size-5" absoluteStrokeWidth />
    </button>

    <CreateButton />

    <div class="hidden items-center gap-2 sm:flex">
      <ChangeCalendarViewButtons />

      <ProfileButton />
    </div>
  </div>
</div>
