<script lang="ts">
  import { AlignLeft, CalendarCheck2, Globe } from "@lucide/svelte";

  import { format } from "date-fns";

  import type { Holiday } from "$lib/shared/types";

  interface Props {
    holiday: Holiday;
  }

  let { holiday }: Props = $props();

  const date = $derived(format(holiday.date, "EEE, MMM d, yyyy"));

  let prevId = $derived(holiday.id);
  let errorMessage = $derived(prevId !== holiday.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-error mt-1 text-sm">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{holiday.name}</h2>

  <div class="flex items-start gap-3">
    <CalendarCheck2 size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1">{date}</div>
  </div>

  <div class="flex items-start gap-3">
    <Globe size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <!-- <div class="flex-1">{holiday.countryName} ({holiday.countryCode})</div> -->
    <div class="flex-1">{holiday.countryCode.toUpperCase()}</div>
  </div>

  <div class="flex items-start gap-3">
    <AlignLeft size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1 whitespace-pre-wrap">{holiday.description}</div>
  </div>
</div>
