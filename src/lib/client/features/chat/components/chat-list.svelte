<script lang="ts">
  import { tick } from "svelte";

  import { Ellipsis, SquarePen } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { chatModal } from "$lib/client/stores/modal";

  import type { Chat } from "$lib/shared/types";

  import { getChats } from "../query";

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

  async function handleChatName(e: Event, chat: Chat) {
    e.stopPropagation();
    e.preventDefault();

    currentDetails.set(chat);
  }

  async function handleEllipsis(chat: Chat) {
    await tick();
    toggleModal(chat.id);
  }
</script>

<div class="w-full">
  <button class="btn btn-ghost my-2 w-full justify-start px-2 text-left" onclick={handleNewChat}>
    <SquarePen size="16" />
    New Chat
  </button>

  <p class="text-primary-content/70 mx-2 my-1 text-sm">Chats</p>

  {#if !$chats}
    <div class="relative h-[200px]">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
        <span class="loading loading-spinner loading-md"></span>
      </div>
    </div>
  {:else if sortedChats.length > 0}
    <div>
      {#each sortedChats as chat (chat.id)}
        <a
          href="/"
          class={`group flex w-full items-center justify-between rounded-lg p-2 py-1.5 text-sm ${$currentDetails?.id === chat.id && "bg-base-200"} hover:bg-base-200/80`}
          onclick={(e) => handleChatName(e, chat)}
        >
          <span class="flex-1 truncate">{chat.name}</span>

          <button
            class="btn btn-ghost btn-square btn-xs invisible opacity-75 group-hover:visible"
            onclick={() => handleEllipsis(chat)}
          >
            <Ellipsis size="15" />
          </button>
        </a>
      {/each}
    </div>
  {:else}
    <p class="text-primary-content/50 m-2 text-sm">No chat history. Start a new chat.</p>
  {/if}
</div>
