<script lang="ts">
  import {
    Calendar03Icon,
    PaintBoardIcon,
    TextAlignLeftIcon,
    UndoIcon
  } from "@hugeicons/core-free-icons";

  import { differenceInYears, format } from "date-fns";

  import type { Birthday } from "$lib/shared/types";

  import { DetailMetaRow, IconRow } from "..";
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

<div class="detail-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <h2 class="detail-title">{birthday.name}</h2>

  <!-- Date of Birth -->
  <IconRow icon={Calendar03Icon}>
    <div class="flex items-center gap-2">
      <p class="font-medium">{dob}</p>
      <div class="detail-badge">{age}</div>
    </div>
  </IconRow>

  <!-- Color -->
  <IconRow icon={PaintBoardIcon}>
    <div class="flex items-center gap-2">
      <span class="font-medium">Color:</span>
      <div
        class="aspect-square w-5 rounded-full"
        style={`background-color: ${birthday.color}`}
      ></div>
    </div>
  </IconRow>

  <!-- Note -->
  {#if birthday.note}
    <IconRow icon={TextAlignLeftIcon} class="items-start">
      <div class="whitespace-pre-wrap">{birthday.note}</div>
    </IconRow>
  {/if}

  <!-- Meta rows -->
  <div class="detail-meta-section">
    <DetailMetaRow icon={UndoIcon}>
      Last edited: {updated}
    </DetailMetaRow>
  </div>

  <ActionButtons id={birthday.id} bind:errorMessage />
</div>
