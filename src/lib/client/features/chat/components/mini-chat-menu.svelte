<script lang="ts">
  import { SquarePen } from "@lucide/svelte";

  import { chatModal } from "$lib/client/stores/modal";

  import { getChats } from "../query";

  import { ChatChoiceField } from ".";

  const { data: chats } = getChats();
  const sortedChats = $derived(
    $chats
      ?.slice()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) ?? []
  );

  const { currentDetails } = chatModal;

  async function handleNewChat() {
    currentDetails.set(null);
  }
</script>

{#if $chats}
  <div class="mb-3 flex items-center gap-2">
    <ChatChoiceField chats={sortedChats} />

    <button class="btn btn-square" onclick={handleNewChat}>
      <SquarePen size="16" />
    </button>
  </div>
{/if}
