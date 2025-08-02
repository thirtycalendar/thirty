<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import { Send } from "@lucide/svelte";

  import { marked } from "marked";

  import { createChatForm } from "../utils/create-chat-form";

  interface Props {
    chat: Chat;
    isMessagesPending: boolean;
  }

  let { chat, isMessagesPending }: Props = $props();
  const form = createChatForm(chat);

  let chatMessagesContainer: HTMLDivElement;

  function handlePromptClick(prompt: string) {
    chat.input = prompt;
    // Wait for the next tick to ensure the input value is updated before submitting
    setTimeout(() => chat.handleSubmit(), 0);
  }

  // Auto-resize on input change
  $effect(() => {
    if (chat.input !== undefined) {
      form.oninput();
    }
  });

  // Smart auto-scroll
  $effect(() => {
    if (chatMessagesContainer) {
      const isScrolledToBottom =
        chatMessagesContainer.scrollHeight - chatMessagesContainer.clientHeight <=
        chatMessagesContainer.scrollTop + 100;

      if (isScrolledToBottom) {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      }
    }
  });
</script>

<main class="relative flex h-screen flex-col">
  <div bind:this={chatMessagesContainer} class="flex-1 overflow-y-auto">
    <div class="mx-auto w-full max-w-[900px] flex-1 p-1">
      {#if isMessagesPending}
        <div class="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/3">
          <span class="loading loading-spinner loading-md"></span>
        </div>
      {:else if chat.messages.length === 0}
        {@render welcomeSection({ onPromptClick: handlePromptClick })}
      {:else}
        <ul class="space-y-8 pb-15">
          {#each chat.messages as message (message.id)}
            <li
              class={`flex space-y-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                class={`${message.role === "user" ? "bg-base-300 text-base-content max-w-xs rounded-xl px-3 py-2 md:max-w-md lg:max-w-lg" : "prose max-w-xs md:max-w-md lg:max-w-lg"}`}
              >
                {#if message.content}
                  <div class="whitespace-pre-wrap">
                    <!-- eslint-disable svelte/no-at-html-tags -->
                    {@html message.role === "assistant"
                      ? marked.parse(message.content)
                      : message.content}
                  </div>
                {/if}
              </div>
            </li>
          {/each}
          {#if chat.status === "submitted"}
            <li class="flex justify-start">
              <div class="flex items-center gap-2">
                <span class="loading loading-dots loading-sm"></span> Thinking...
              </div>
            </li>
          {/if}
        </ul>
      {/if}
    </div>
  </div>

  <form onsubmit={form.onsubmit} class="sticky bottom-3 flex w-full items-end p-2">
    <div class="relative mx-auto w-full max-w-[900px]">
      <div
        class="relative flex items-end rounded-2xl border border-base-200 bg-base-100 shadow-lg transition-colors"
      >
        <textarea
          bind:this={form.textareaRef}
          bind:value={chat.input}
          onkeydown={form.onkeydown}
          oninput={form.oninput}
          class="w-full resize-none bg-transparent px-4 py-3 pr-12 text-base placeholder-base-content/60 focus:outline-none min-h-[52px] max-h-[200px]"
          placeholder="Send a message..."
        ></textarea>
        <button
          type="submit"
          disabled={!chat.input.trim() || chat.status === "submitted"}
          class="absolute bottom-2 right-2 rounded-full bg-primary p-2 text-primary-content transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-base-300 disabled:text-base-content/50"
        >
          <Send size={17} />
        </button>
      </div>
      <div class="mt-2 text-center text-xs text-base-content/60">
        Thirty AI can make mistakes. Check important info.
      </div>
    </div>
  </form>
</main>

{#snippet welcomeSection({ onPromptClick }: { onPromptClick: (prompt: string) => void })}
  {@const prompts = [
    {
      title: "📅 Schedule events",
      text: "Schedule a meeting with the design team for tomorrow at 2 PM"
    },
    { title: "🔍 Find free time", text: "What free slots do I have next Monday morning?" },
    {
      title: "⏰ Manage conflicts",
      text: "My 3 PM meeting has a conflict, can you find another time?"
    },
    { title: "📊 View schedule", text: "Show me my schedule for this Friday" }
  ]}
  <div class="flex h-full flex-col items-center justify-center px-4 text-center">
    <div class="mb-8">
      <h1 class="mb-4 text-4xl font-bold text-base-content">How can I help with your calendar?</h1>
      <p class="mb-6 text-lg text-base-content/70">
        I'm your AI calendar assistant, ready to help you manage your schedule efficiently.
      </p>
      <div class="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        {#each prompts as prompt (prompt.title)}
          <button
            onclick={() => onPromptClick(prompt.text)}
            class="rounded-lg bg-base-200 p-4 text-left transition-colors hover:bg-base-300"
          >
            <h3 class="mb-2 font-semibold text-base-content">{prompt.title}</h3>
            <p class="text-sm text-base-content/60">{prompt.text}</p>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/snippet}
