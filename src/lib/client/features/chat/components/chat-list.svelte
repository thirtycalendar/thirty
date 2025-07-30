<script lang="ts">
  import { Ellipsis, SquarePen } from "@lucide/svelte";

  import { chatModal } from "$lib/client/stores/modal";

  import type { Chat } from "$lib/shared/types";

  import { getChats } from "../query";

  const { data: chats } = getChats();

  function handleClick(e: Event, chat: Chat) {
    e.stopPropagation();
    e.preventDefault();

    chatModal.handleModal(chat);
  }

  function handleEllipsis() {
    console.log("clicked...");
  }
</script>

<div class="w-full">
  <a href="/chat" class="btn my-2 px-2 btn-ghost text-left justify-start w-full">
    <SquarePen size="16" />
    New Chat
  </a>

  <p class="text-sm mx-2 text-primary-content/70 my-1">Chats</p>

  {#if !$chats}
    <div class="relative h-[200px]">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
        <span class="loading loading-spinner loading-md"></span>
      </div>
    </div>
  {:else if $chats.length > 0}
    <div>
      {#each $chats as chat (chat.id)}
        <a
          href="/"
          class="group flex items-center justify-between text-sm p-2 py-1.5 w-full rounded-lg hover:bg-base-200/80"
          onclick={(e) => handleClick(e, chat)}
        >
          <span class="truncate flex-1">{chat.name}</span>

          <button
            class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
            onclick={handleEllipsis}
          >
            <Ellipsis size="15" />
          </button>
        </a>
      {/each}
    </div>
  {:else}
    <p class="text-sm m-2 text-primary-content/50">No chat history. Start a new one.</p>
  {/if}
</div>
