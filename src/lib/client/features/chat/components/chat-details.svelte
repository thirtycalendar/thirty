<script lang="ts">
  // import { format } from "date-fns";

  import type { Chat } from "$lib/shared/types";

  import { ChatActionButtons } from ".";

  interface Props {
    chat: Chat;
  }

  let { chat }: Props = $props();

  // const updated = $derived(format(new Date(chat.updatedAt), "PPp"));

  let prevId = $derived(chat.id);
  let errorMessage = $derived(prevId !== chat.id ? "" : "");
</script>

<div class="space-y-3">
  {#if errorMessage !== ""}
    <p class="text-sm text-error mt-1">{errorMessage}</p>
  {/if}

  <h2 class="text-xl font-semibold">{chat.name}</h2>

  <!-- <div class="mt-4 space-y-1">
    <div class="flex items-center">
      <HistoryIcon size="14" strokeWidth="2.5" class="mr-2" />
      <p class="text-sm font-semibold">
        Last chatted: {updated}
      </p>
    </div>
  </div> -->

  <ChatActionButtons id={chat.id} bind:errorMessage />
</div>
