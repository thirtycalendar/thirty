<script lang="ts">
  import { tick } from "svelte";

  import { Settings01Icon } from "@hugeicons/core-free-icons";

  import { chatsQuery } from "$lib/client/data/queries/chat";
  import { chatDetailsModalStore, chatHistoryModalStore } from "$lib/client/stores/modal";

  import type { Chat } from "$lib/shared/types";

  import { Icon } from "../icons";
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

  async function handleSettings(chat: Chat) {
    chatDetailsModalStore.openModal(chat);
  }
</script>

<Modal id={modalId} title="History" class="z-[9998]">
  {#if sortedChats.length > 0}
    {#each sortedChats as chat (chat.id)}
      <button
        type="button"
        class="group btn btn-ghost text-primary-content/80 flex w-full items-center justify-between px-2 py-1 pr-0 font-normal"
        onclick={() => handleClick(chat.id)}
      >
        <span class="w-full truncate text-start text-sm text-ellipsis whitespace-nowrap">
          {chat.name}
        </span>

        <span
          role="button"
          tabindex="0"
          class="btn btn-ghost btn-square opacity-0 transition-opacity group-hover:opacity-100"
          onclick={(e) => {
            e.stopPropagation();
            handleSettings(chat);
          }}
          onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleSettings(chat);
            }
          }}
        >
          <Icon icon={Settings01Icon} size={15} />
        </span>
      </button>
    {/each}
  {:else}
    <p class="text-primary-content/50 my-2 text-sm">Nothing yet. Start a new chat.</p>
  {/if}
</Modal>
