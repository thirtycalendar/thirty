<script lang="ts">
  import { AlignLeft, CalendarCheck2, HistoryIcon, Palette } from "@lucide/svelte";

  import { differenceInYears, format } from "date-fns";

  import type { Birthday } from "$lib/shared/types";

  import { BdActionButtons } from ".";

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
    <CalendarCheck2 size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />
    <div class="flex flex-1 items-center gap-2">
      <p class="font-medium">{dob}</p>
      <div class="badge badge-outline badge-xs">{age}</div>
    </div>
  </div>

  <div class="flex items-start gap-3">
    <Palette size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />
    <div class="flex flex-1 items-center gap-2">
      <span class="capitalize">Color:</span>
      <div class="aspect-square w-5 rounded-full" style="background-color: {birthday.color}"></div>
    </div>
  </div>

  {#if birthday.note}
    <div class="flex items-start gap-3">
      <AlignLeft size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />
      <div class="flex-1 whitespace-pre-wrap">{birthday.note}</div>
    </div>
  {/if}

  <div class="mt-4 space-y-1">
    <div class="flex items-center">
      <HistoryIcon size="14" strokeWidth="2.5" class="mr-2" />
      <p class="text-sm font-semibold">
        Last edited: {updated}
      </p>
    </div>
  </div>

  <BdActionButtons id={birthday.id} bind:errorMessage />
</div>
