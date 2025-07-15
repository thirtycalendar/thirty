<script lang="ts">
  import { Globe } from "@lucide/svelte";

  import type { Holiday } from "$lib/shared/types";

  interface Props {
    holiday: Holiday;
  }

  let { holiday }: Props = $props();

  let prevId = $derived(holiday.id);
  let errorMessage = $derived(prevId !== holiday.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{holiday.name}</h2>

  <div class="flex items-start gap-3">
    <Globe size="20" strokeWidth="2.5" class="text-muted-foreground mt-0.5 shrink-0" />

    <div class="flex-1">{holiday.countryName} ({holiday.countryCode})</div>
  </div>
</div>
