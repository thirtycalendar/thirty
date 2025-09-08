<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { SentIcon } from "@hugeicons/core-free-icons";

  import { Icon } from "../icons";

  import { Modal } from ".";

  let input = $state("");
  const chat = new Chat({});
  let textareaRef: HTMLTextAreaElement | null = null;

  function oninput() {
    if (!textareaRef) return;
    textareaRef.style.height = "auto";
    textareaRef.style.height = `${textareaRef.scrollHeight}px`;
  }

  function onsubmit(e: Event) {
    e.preventDefault();
    if (!input.trim()) return;

    chat.sendMessage({ text: input });
    input = "";

    if (textareaRef) {
      textareaRef.style.height = "auto";
    }
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onsubmit(e);
    }
  }
</script>

<Modal>
  <div class="mx-auto flex h-full max-w-2xl flex-col">
    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-2">
      {#each chat.messages as message, i (i)}
        <div>{message.role}</div>
        <div>
          {#each message.parts as part, i (i)}
            {#if part.type === "text"}
              <div>{part.text}</div>
            {/if}
          {/each}
        </div>
      {/each}
    </div>

    <!-- Input -->
    <form {onsubmit} class="sticky bottom-0 w-full p-1">
      <textarea
        bind:this={textareaRef}
        bind:value={input}
        {oninput}
        {onkeydown}
        class="bg-base-300 max-h-[200px] min-h-[75px] w-full resize-none rounded-lg p-2 pr-14 text-sm focus:outline-none"
        placeholder="Send a message..."
      ></textarea>

      <button type="submit" class="btn btn-circle absolute right-3 bottom-5 -translate-y-1/2 p-2">
        <Icon icon={SentIcon} class="opacity-75 hover:opacity-100" />
      </button>

      <div class="text-base-content/60 mb-2 text-center text-[10px]">
        Thirty AI can make mistakes. Check important info.
      </div>
    </form>
  </div>
</Modal>
