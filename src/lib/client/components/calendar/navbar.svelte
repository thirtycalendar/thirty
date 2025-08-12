<script lang="ts">
  import { calView } from "$lib/client/stores/cal-view";
  import { currentDate } from "$lib/client/stores/change-date";

  import { Sidebar } from "../icons";

  import { ChangeCalViewButtons, ChangeDateButtons, CreateButton } from ".";

  const month = $derived(new Intl.DateTimeFormat("en-US", { month: "short" }).format($currentDate));
  const year = $derived(new Intl.DateTimeFormat("en-US", { year: "numeric" }).format($currentDate));
</script>

<div class="flex items-center justify-between">
  <div class="flex items-center gap-1">
    <button class="btn btn-link btn-square text-primary-content mx-2">
      <Sidebar strokeWidth="2.2" />
    </button>

    <div>
      <p class="flex gap-1 font-semibold sm:text-lg">
        {#if $calView === "year"}
          {year}
        {:else}
          {month} <span class="text-base-content/75 hidden sm:flex">{year}</span>
        {/if}
      </p>
    </div>

    <ChangeDateButtons />
  </div>

  <div class="flex items-center gap-2">
    <CreateButton />

    <ChangeCalViewButtons />
  </div>
</div>
