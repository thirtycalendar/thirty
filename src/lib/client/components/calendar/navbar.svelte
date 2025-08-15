<script lang="ts">
  import { SidebarLeftIcon } from "@hugeicons/core-free-icons";

  import { currentCalView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";
  import { toggleMainSidebar } from "$lib/client/stores/sidebar";

  import { ProfileButton } from "../auth";
  import { Icon } from "../icons";

  import { ChangeCalViewButtons, ChangeDateButtons, CreateButton } from ".";

  const month = $derived(new Intl.DateTimeFormat("en-US", { month: "short" }).format($currentDate));
  const year = $derived(new Intl.DateTimeFormat("en-US", { year: "numeric" }).format($currentDate));
</script>

<div class="flex items-center justify-between text-xs">
  <div class="flex items-center gap-1">
    <button
      class="btn btn-link btn-square text-primary-content/80 hover:text-primary-content mx-2"
      onclick={toggleMainSidebar}
    >
      <Icon icon={SidebarLeftIcon} strokeWidth={2} absoluteStrokeWidth />
    </button>

    <div>
      <p class="flex gap-1 font-semibold sm:text-lg">
        {#if $currentCalView === "year"}
          {year}
        {:else}
          {month} <span class="text-base-content/75 hidden font-normal sm:flex">{year}</span>
        {/if}
      </p>
    </div>

    <ChangeDateButtons />
  </div>

  <div class="flex items-center gap-2">
    <CreateButton />

    <ChangeCalViewButtons />

    <ProfileButton />
  </div>
</div>
