<script lang="ts">
  import { Calendar03Icon, GlobalIcon, TextAlignLeftIcon } from "@hugeicons/core-free-icons";

  import { format } from "date-fns";

  import type { Holiday } from "$lib/shared/types";

  import { IconRow } from "..";

  interface Props {
    holiday: Holiday;
  }

  let { holiday }: Props = $props();

  const date = $derived(format(holiday.date, "EEE, MMM d, yyyy"));

  let prevId = $derived(holiday.id);
  let errorMessage = $derived(prevId !== holiday.id ? "" : "");
</script>

<div class="detail-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <h2 class="detail-title">{holiday.name}</h2>

  <!-- Holiday Date -->
  <IconRow icon={Calendar03Icon}>
    <div>{date}</div>
  </IconRow>

  <!-- Country info -->
  <IconRow icon={GlobalIcon}>
    <div>{holiday.countryName} ({holiday.countryCode})</div>
  </IconRow>

  <!-- Description -->
  {#if holiday.description}
    <IconRow icon={TextAlignLeftIcon} class="items-start">
      <div class="whitespace-pre-wrap">{holiday.description}</div>
    </IconRow>
  {/if}
</div>
