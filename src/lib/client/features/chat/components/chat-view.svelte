<script lang="ts">
  import type { Chat } from "@ai-sdk/svelte";
  import { Send } from "@lucide/svelte";

  interface Props {
    chat: Chat;
  }

  let { chat }: Props = $props();
  let textareaRef: HTMLTextAreaElement;

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
</script>

<main class="flex h-screen flex-col">
  <div class="flex flex-1 flex-col overflow-y-auto">
    <div class="mx-auto w-full max-w-[900px] flex-1 p-1">
      <ul class="space-y-8 pb-4">
        {#each chat.messages as message, i (i)}
          <li class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              class={`${message.role === "user" && "bg-base-300 text-base-content max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-xl"}`}
            >
              {#each message.parts as part, j (j)}
                {#if part.type === "text"}
                  <div class="whitespace-pre-wrap">{part.text}</div>
                {/if}
              {/each}
            </div>
          </li>
        {/each}
        {#if chat.status === "submitted"}
          <li class="animate-pulse">Generating...</li>
        {/if}
      </ul>
    </div>

    <form {onsubmit} class="sticky bottom-5 flex w-full items-end p-2">
      <div class="mx-auto w-full max-w-[900px] relative">
        <div
          class="relative flex items-end bg-base-100 border border-base-300 rounded-2xl shadow-lg focus-within:border-primary transition-colors"
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
            <Send size={18} />
          </button>
        </div>

        <div class="text-xs text-base-content/60 text-center mt-2">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </form>
  </div>
</main>
