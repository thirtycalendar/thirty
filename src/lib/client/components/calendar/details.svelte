<script lang="ts">
  import {
    CheckmarkCircle02Icon,
    FileSyncIcon,
    GlobalRefreshIcon,
    UndoIcon
  } from "@hugeicons/core-free-icons";

  import { format } from "date-fns";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import type { Calendar } from "$lib/shared/types";

  import { DetailMetaRow, IconRow } from "..";
  import { ActionButtons } from ".";

  interface Props {
    calendar: Calendar;
  }

  let { calendar }: Props = $props();

  const updated = $derived(format(new Date(calendar.updatedAt), "PPp"));

  let prevId = $derived(calendar.id);
  let errorMessage = $derived(prevId !== calendar.id ? "" : "");
</script>

<div class="detail-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <h2 class="detail-title">
    <div class="aspect-square w-5 rounded-full" style={`background-color: ${calendar.color}`}></div>
    {calendar.name}
  </h2>

  <!-- Timezone -->
  <IconRow icon={GlobalRefreshIcon}>
    <div>{calendar.timezone}</div>
  </IconRow>

  <!-- Primary -->
  {#if calendar.isPrimary}
    <IconRow icon={CheckmarkCircle02Icon}>
      <div class="capitalize">Primary calendar</div>
    </IconRow>
  {/if}

  <!-- Meta rows -->
  <div class="detail-meta-section">
    {#if calendar.source !== "local"}
      <DetailMetaRow icon={FileSyncIcon}>
        Synced from {capitalizeFirstLetter(calendar.source)}
      </DetailMetaRow>
    {/if}

    <DetailMetaRow icon={UndoIcon}>
      Last edited: {updated}
    </DetailMetaRow>
  </div>

  <ActionButtons id={calendar.id} bind:errorMessage />
</div>
