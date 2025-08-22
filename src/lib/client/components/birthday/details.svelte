<script lang="ts">
  import {
    Calendar03Icon,
    PaintBoardIcon,
    TextAlignLeftIcon,
    UndoIcon
  } from "@hugeicons/core-free-icons";

  import { differenceInYears, format } from "date-fns";

  import type { Birthday } from "$lib/shared/types";

  import { Icon } from "../icons";

  import { ActionButtons } from ".";

  interface Props {
    birthday: Birthday;
  }

  let { birthday }: Props = $props();

  const dob = $derived(format(birthday.dob, "EEE d, MMM yyyy"));
  const age = $derived.by(() => {
    const years = differenceInYears(new Date(), birthday.dob);
    return years === 1 ? "1 yr" : `${years} yrs`;
  });

  const updated = $derived(format(new Date(birthday.updatedAt), "PPp"));

  let prevId = $derived(birthday.id);
  let errorMessage = $derived(prevId !== birthday.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{birthday.name}</h2>

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-0.5">
      <Icon icon={Calendar03Icon} strokeWidth={1.8} absoluteStrokeWidth />
    </div>

    <div class="flex flex-1 items-center gap-2">
      <p class="font-medium">{dob}</p>
      <div class="badge badge-outline badge-xs">{age}</div>
    </div>
  </div>

  <div class="flex items-start gap-3">
    <div class="text-muted-foreground pt-0.5">
      <Icon icon={PaintBoardIcon} strokeWidth={1.8} absoluteStrokeWidth />
    </div>

    <div class="flex flex-1 items-center gap-2">
      <span class="capitalize">Color:</span>
      <div class="aspect-square w-5 rounded-full" style="background-color: {birthday.color}"></div>
    </div>
  </div>

  {#if birthday.note}
    <div class="flex items-start gap-3">
      <div class="text-muted-foreground pt-0.5">
        <Icon icon={TextAlignLeftIcon} strokeWidth={1.8} absoluteStrokeWidth />
      </div>

      <div class="flex-1 whitespace-pre-wrap">{birthday.note}</div>
    </div>
  {/if}

  <div class="mt-5 space-y-1">
    <div class="flex items-center">
      <Icon icon={UndoIcon} size={14} strokeWidth={1.8} class="mr-2" absoluteStrokeWidth />

      <p class="text-sm font-semibold">
        Last edited: {updated}
      </p>
    </div>
  </div>

  <ActionButtons id={birthday.id} bind:errorMessage />
</div>
