<script lang="ts">
  import { SquarePen } from "@lucide/svelte";

  import { getChats } from "../query";

  import { ChatChoiceField } from ".";

  const { data: chats } = $derived.by(() => getChats());
</script>

{#if $chats}
  <div class="flex items-center gap-2">
    <ChatChoiceField chats={$chats} />

    <button class="btn btn-square">
      <SquarePen size="16" />
    </button>
  </div>
{/if}
