<script lang="ts">
  import { tick } from "svelte";

  import { chatsQuery } from "$lib/client/data/queries/chat";
  import { chatHistoryModalStore } from "$lib/client/stores/modal";

  import { activeChatId } from "./utils";

  import { Modal } from "..";

  const { data: chats } = chatsQuery();
  const sortedChats = $derived(
    $chats
      ? [...$chats].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      : []
  );

  const { modalId, toggleModal } = chatHistoryModalStore;

  async function handleClick(chatId: string) {
    activeChatId.set(chatId);

    await tick();
    toggleModal();
  }
</script>

<Modal id={modalId} title="History">
  {#if sortedChats.length > 0}
    {#each sortedChats as chat (chat.id)}
      <button
        class="group btn btn-ghost flex w-full items-center justify-start px-2 py-1 font-normal"
        onclick={() => handleClick(chat.id)}
      >
        <span class="w-full truncate text-start text-sm text-ellipsis whitespace-nowrap">
          {chat.name}
        </span>
      </button>
    {/each}
  {:else}
    <p class="text-primary-content/50 my-2 text-sm">Nothing yet. Start a new chat.</p>
  {/if}
</Modal>
