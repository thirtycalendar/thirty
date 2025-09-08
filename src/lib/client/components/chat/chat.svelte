<script lang="ts">
  import { Chat } from "@ai-sdk/svelte";
  import { SentIcon } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";
  import { isMaximize } from "./utils";

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
  <div class="flex h-full flex-col">
    <!-- Messages -->
    <div class="flex-1 overflow-y-auto">
      <div class="mx-auto w-full max-w-3xl p-2">
        {#each chat.messages as message, i (i)}
          <div
            class={cn(
              "text-primary-content/80 mb-2 flex",
              $isMaximize ? "text-base" : "text-sm",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {#each message.parts as part, i (i)}
              {#if part.type === "text"}
                <div
                  class={cn(
                    message.role === "user" &&
                      "bg-base-200/50 text-base-content max-w-xs rounded-lg px-3 py-2 md:max-w-md lg:max-w-lg"
                  )}
                >
                  {part.text}
                </div>
              {/if}
            {/each}
          </div>
        {/each}
      </div>
    </div>

    <!-- Input -->
    <form {onsubmit} class="sticky bottom-0 w-full p-1 pt-0">
      <div class="relative mx-auto w-full max-w-3xl">
        <textarea
          bind:this={textareaRef}
          bind:value={input}
          {oninput}
          {onkeydown}
          class={cn(
            "bg-base-200/75 text-primary-content/80 max-h-[200px] min-h-[75px] w-full resize-none pr-14 focus:outline-none",
            $isMaximize ? "rounded-xl p-3 text-base" : "rounded-lg p-2 text-sm"
          )}
          placeholder="Send a message..."
        ></textarea>

        <button type="submit" class="btn btn-circle btn-secondary absolute right-2 bottom-4 p-2">
          <Icon icon={SentIcon} class="opacity-75 hover:opacity-100" />
        </button>
      </div>

      <div class="text-base-content/60 mb-2 text-center text-[10px]">
        Thirty AI can make mistakes. Check important info.
      </div>
    </form>
  </div>
</Modal>
