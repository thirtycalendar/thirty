<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import { Send } from "@lucide/svelte";

  interface Props {
    chat: Chat;
    isMessagesPending: boolean;
  }

  let { chat, isMessagesPending }: Props = $props();
  let textareaRef: HTMLTextAreaElement;
  let chatMessagesContainer: HTMLDivElement;

  function onsubmit(e: Event) {
    e.preventDefault();
    if (chat.input.trim()) {
      chat.handleSubmit();
      if (textareaRef) {
        textareaRef.style.height = "auto";
      }
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onsubmit(e);
    }
  }

  function autoResize() {
    if (textareaRef) {
      textareaRef.style.height = "auto";
      textareaRef.style.height = Math.min(textareaRef.scrollHeight, 200) + "px";
    }
  }

  // Auto-resize when input changes
  $effect(() => {
    if (chat.input !== undefined) {
      autoResize();
    }
  });

  // Auto-scroll to the bottom when new messages arrive
  $effect(() => {
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  });
</script>

<main class="relative flex h-screen flex-col">
  <div bind:this={chatMessagesContainer} class="flex flex-1 flex-col overflow-y-auto">
    <div class="mx-auto w-full max-w-[900px] flex-1 p-1">
      {#if isMessagesPending}
        <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3">
          <span class="loading loading-spinner loading-md"></span>
        </div>
      {:else if chat.messages.length === 0}
        {@render welcomeSection()}
      {:else}
        <ul class="space-y-8 pb-15">
          {#each chat.messages as message, i (i)}
            <li
              class={`flex space-y-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                class={`${message.role === "user" && "bg-base-300 text-base-content max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-xl"}`}
              >
                {#each message.parts as part, j (j)}
                  {#if part.type === "text"}
                    {#if message.role === "assistant"}
                      <div class="whitespace-pre-wrap">{part.text}</div>
                    {:else}
                      <div class="whitespace-pre-wrap">{part.text}</div>
                    {/if}
                  {/if}
                {/each}
              </div>
            </li>
          {/each}
          {#if chat.status === "submitted"}
            <div class="flex gap-2">
              <span class="loading loading-dots loading-sm"></span>
              <p>Thinking...</p>
            </div>
          {/if}
        </ul>
      {/if}
    </div>

    <form {onsubmit} class="sticky bottom-5 flex w-full items-end p-2">
      <div class="mx-auto w-full max-w-[900px] relative">
        <div
          class="relative flex items-end bg-base-100 border border-base-200 rounded-2xl shadow-lg transition-colors"
        >
          <textarea
            bind:this={textareaRef}
            bind:value={chat.input}
            onkeydown={handleKeydown}
            oninput={autoResize}
            class="flex-1 resize-none bg-transparent px-4 py-3 pr-12 text-base placeholder-base-content/60 focus:outline-none min-h-[52px] max-h-[200px]"
            placeholder="Send a message..."
            rows="3"
          ></textarea>
          <button
            type="submit"
            disabled={!chat.input.trim() || chat.status === "submitted"}
            class="absolute right-2 bottom-2 p-2 rounded-full bg-primary text-primary-content hover:bg-primary/90 disabled:bg-base-300 disabled:text-base-content/50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={17} />
          </button>
        </div>
        <div class="text-xs text-base-content/60 text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </form>
  </div>
</main>

#{#snippet welcomeSection()}
  <div class="flex flex-col items-center justify-center h-full text-center px-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-base-content mb-4">How can I help with your calendar?</h1>
      <p class="text-lg text-base-content/70 mb-6">
        I'm your AI calendar assistant, ready to help you manage your schedule efficiently.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div class="bg-base-200 rounded-lg p-4 text-left">
          <h3 class="font-semibold text-base-content mb-2">📅 Schedule events</h3>
          <p class="text-sm text-base-content/60">Create meetings, appointments, and reminders</p>
        </div>
        <div class="bg-base-200 rounded-lg p-4 text-left">
          <h3 class="font-semibold text-base-content mb-2">🔍 Find free time</h3>
          <p class="text-sm text-base-content/60">
            Check availability and suggest optimal meeting times
          </p>
        </div>
        <div class="bg-base-200 rounded-lg p-4 text-left">
          <h3 class="font-semibold text-base-content mb-2">⏰ Manage conflicts</h3>
          <p class="text-sm text-base-content/60">
            Resolve scheduling conflicts and reschedule events
          </p>
        </div>
        <div class="bg-base-200 rounded-lg p-4 text-left">
          <h3 class="font-semibold text-base-content mb-2">📊 View schedule</h3>
          <p class="text-sm text-base-content/60">Get summaries of your day, week, or month</p>
        </div>
      </div>
    </div>
  </div>
{/snippet}
