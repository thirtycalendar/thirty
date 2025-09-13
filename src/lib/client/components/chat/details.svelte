<script lang="ts">
  import { UndoIcon } from "@hugeicons/core-free-icons";

  import { format } from "date-fns";

  import type { Chat } from "$lib/shared/types";

  import { DetailMetaRow } from "..";
  import { ActionButtons } from ".";

  interface Props {
    chat: Chat;
  }

  let { chat }: Props = $props();

  const updated = $derived(format(new Date(chat.updatedAt), "PPp"));

  let prevId = $derived(chat.id);
  let errorMessage = $derived(prevId !== chat.id ? "" : "");
</script>

<div class="detail-section">
  {#if errorMessage !== ""}
    <p class="error-text">{errorMessage}</p>
  {/if}

  <h2 class="detail-title">{chat.name}</h2>

  <!-- Meta rows -->
  <div class="detail-meta-section">
    <DetailMetaRow icon={UndoIcon}>
      Last edited: {updated}
    </DetailMetaRow>
  </div>

  <ActionButtons id={chat.id} bind:errorMessage />
</div>
