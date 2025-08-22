<script lang="ts">
  import {
    CheckmarkCircle02Icon,
    FileSyncIcon,
    GlobalRefreshIcon,
    PaintBoardIcon,
    UndoIcon
  } from "@hugeicons/core-free-icons";

  import { format } from "date-fns";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";
  import type { Calendar } from "$lib/shared/types";

  import { Icon } from "../icons";

  import { ActionButtons } from ".";

  interface Props {
    calendar: Calendar;
  }

  let { calendar }: Props = $props();

  const updated = $derived(format(new Date(calendar.updatedAt), "PPp"));

  let prevId = $derived(calendar.id);
  let errorMessage = $derived(prevId !== calendar.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{calendar.name}</h2>

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-0.5">
      <Icon icon={PaintBoardIcon} strokeWidth={2} absoluteStrokeWidth />
    </div>
    <div class="flex flex-1 items-center gap-2">
      <span class="capitalize">Color:</span>
      <div class="aspect-square w-5 rounded-full" style="background-color: {calendar.color}"></div>
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-0.5">
      <Icon icon={GlobalRefreshIcon} strokeWidth={2} absoluteStrokeWidth />
    </div>
    <div class="flex-1">{calendar.timezone}</div>
  </div>

  {#if calendar.isPrimary}
    <div class="flex items-start gap-3">
      <div class="text-muted-foreground pt-0.5">
        <Icon icon={CheckmarkCircle02Icon} strokeWidth={2} absoluteStrokeWidth />
      </div>
      <div class="flex-1 capitalize">Primary calendar</div>
    </div>
  {/if}

  <div class="mt-4 space-y-1">
    {#if calendar.source !== "local"}
      <div class="flex items-center">
        <Icon icon={FileSyncIcon} size={14} strokeWidth={2} class="mr-2" absoluteStrokeWidth />

        <p class="text-sm font-semibold">
          Synced from {capitalizeFirstLetter(calendar.source)}
        </p>
      </div>
    {/if}

    <div class="flex items-center">
      <Icon icon={UndoIcon} size={14} strokeWidth={2} class="mr-2" absoluteStrokeWidth />

      <p class="text-sm font-semibold">
        Last edited: {updated}
      </p>
    </div>
  </div>

  <ActionButtons id={calendar.id} bind:errorMessage />
</div>
