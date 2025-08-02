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

  const chatForm = $derived.by(() => createChatForm(chat));

  function handlePromptClick(prompt: string) {
    chat.input = prompt;
    setTimeout(() => chat.handleSubmit(), 0);
  }

  $effect(() => {
    if (chat.input !== undefined) {
      chatForm.oninput();
    }
  });
</script>

<main class="relative flex h-screen flex-col">
  <div class="flex-1 overflow-y-auto">
    {#if isMessagesPending}
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
        <span class="loading loading-spinner loading-md"></span>
      </div>
    {:else if chat.messages.length === 0}
      {@render welcomeSection({ onPromptClick: handlePromptClick })}
    {:else}
      <div class="relative mx-auto w-full max-w-[900px] flex-1 p-1">
        <ul class="space-y-8 pb-15">
          {#each chat.messages as message (message.id)}
            <div class={`flex  ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                class={`${message.role === "user" && "bg-base-300 text-base-content max-w-xs rounded-xl px-3 py-2 md:max-w-md lg:max-w-lg"}`}
              >
                {#if message.content}
                  <div class="flex flex-col space-y-5">
                    <!-- eslint-disable svelte/no-at-html-tags -->
                    {@html message.role === "assistant"
                      ? marked.parse(message.content)
                      : message.content}
                  </div>
                {/if}
              </div>
            </div>
          {/each}

          {#if chat.status === "submitted" || chat.messages.at(-1)?.role === "user"}
            <div class="flex justify-start">
              <div class="flex items-center gap-2">
                <span class="loading loading-dots loading-sm"></span> Thinking...
              </div>
            </div>
          {/if}
        </ul>
      </div>
    {/if}
  </div>

  <chatForm onsubmit={chatForm.onsubmit} class="sticky bottom-3 flex w-full items-end p-2">
    <div class="relative mx-auto w-full max-w-[900px]">
      <div
        class="border-base-200 bg-base-100 relative flex items-end rounded-2xl border shadow-lg transition-colors"
      >
        <textarea
          bind:this={chatForm.textareaRef}
          bind:value={chat.input}
          onkeydown={chatForm.onkeydown}
          oninput={chatForm.oninput}
          class="placeholder-base-content/60 max-h-[200px] min-h-[52px] w-full resize-none bg-transparent px-4 py-3 pr-12 text-base focus:outline-none"
          placeholder="Send a message..."
        ></textarea>

        <button
          type="submit"
          disabled={!chat.input.trim() ||
            chat.status === "submitted" ||
            chat.status === "streaming"}
          class="bg-primary text-primary-content hover:bg-primary/90 disabled:bg-base-300 disabled:text-base-content/50 absolute right-2 bottom-2 rounded-full p-2 transition-colors disabled:cursor-not-allowed"
        >
          <Send size={17} />
        </button>
      </div>

      <div class="text-base-content/60 mt-2 text-center text-xs">
        Thirty AI can make mistakes. Check important info.
      </div>
    </div>
  </chatForm>
</main>

{#snippet welcomeSection({ onPromptClick }: { onPromptClick: (prompt: string) => void })}
  {@const prompts = [
    // {
    //   title: "📅 Schedule events",
    //   text: "Schedule a meeting with the design team for tomorrow at 2 PM"
    // },
    { title: "🔍 Find free time", text: "What free slots do I have next Monday morning?" },
    // {
    //   title: "⏰ Manage conflicts",
    //   text: "My 3 PM meeting has a conflict, can you find another time?"
    // },
    { title: "📊 View schedule", text: "Show me my schedule for this Friday" }
  ]}

  <div class="flex h-full items-center justify-center px-4 text-center">
    <div class="mb-8">
      <h1 class="text-base-content mb-10 text-4xl font-bold">How can I help with your calendar?</h1>

      <!-- <p class="text-base-content/70 mb-6 text-lg">
        I'm your AI calendar assistant, ready to help you manage your schedule efficiently.
      </p> -->

      <div class="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
        {#each prompts as prompt (prompt.title)}
          <button
            onclick={() => onPromptClick(prompt.text)}
            class="bg-base-300 hover:bg-base-300 rounded-lg p-4 text-left transition-colors"
          >
            <h3 class="text-base-content mb-2 font-semibold">{prompt.title}</h3>

            <p class="text-base-content/60 text-sm">{prompt.text}</p>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/snippet}
