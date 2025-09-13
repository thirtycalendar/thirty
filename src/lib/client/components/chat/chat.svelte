<script lang="ts">
  import Markdown from "svelte-markdown";

  import { Chat } from "@ai-sdk/svelte";
  import { SentIcon } from "@hugeicons/core-free-icons";

  import { checkoutMutation } from "$lib/client/data/mutations";
  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";
  import { isMaximize } from "./utils";

  import { Modal } from ".";

  let input = $state("");
  let errorMessage = $state("");
  let isToolCalling = $state(false);

  let textareaRef: HTMLTextAreaElement | null = null;

  const { mutate: handleUpgrade } = checkoutMutation();

  const chat = new Chat({
    get id() {
      return "393d092f-1703-487f-bc85-75661f715c7d";
    },
    onToolCall: () => {
      isToolCalling = true;
    },
    onFinish: () => {
      isToolCalling = false;
    },
    onError: (error) => {
      errorMessage = error.message;
    }
  });

  const isThinking = $derived(chat.status === "submitted");
  const isStreaming = $derived(chat.status === "streaming");

  function oninput() {
    if (!textareaRef) return;
    textareaRef.style.height = "auto";
    textareaRef.style.height = `${textareaRef.scrollHeight}px`;
  }

  function onsubmit(e: Event) {
    e.preventDefault();
    if (!input.trim() || isThinking || isStreaming) return;

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
      <div
        class={cn(
          "text-primary-content/80 mx-auto w-full max-w-3xl p-2",
          $isMaximize ? "text-base" : "text-sm"
        )}
      >
        {#each chat.messages as message, i (i)}
          <div class={cn("my-2 flex", message.role === "user" ? "justify-end" : "justify-start")}>
            {#each message.parts as part, i (i)}
              {#if part.type === "text"}
                {#if message.role === "user"}
                  <!-- User bubble -->
                  <div
                    class={cn(
                      "bg-base-200/50 max-w-xs rounded-lg px-3 py-2 md:max-w-md lg:max-w-lg"
                    )}
                  >
                    {part.text}
                  </div>
                {:else}
                  <div class="ai-message">
                    <Markdown source={part.text} />
                  </div>
                {/if}
              {/if}
            {/each}
          </div>
        {/each}

        <div class="my-2 animate-pulse">
          {#if isThinking}
            Thinking...
          {:else if isStreaming && isToolCalling}
            Generating...
          {/if}
        </div>
      </div>
    </div>

    <!-- Input -->
    <form {onsubmit} class="sticky bottom-0 w-full p-1 pt-0">
      <div class="relative mx-auto w-full max-w-3xl">
        {#if errorMessage}
          <div
            class={cn(
              "badge-outline badge badge-error badge-soft my-2 w-full justify-start",
              $isMaximize && "badge-lg"
            )}
          >
            {#if errorMessage.includes("No credits left")}
              <p>
                <button
                  class="text-error cursor-pointer font-medium underline"
                  onclick={handleUpgrade}
                  type="button"
                >
                  Upgrade to Pro
                </button>
                for unlimited messages.
              </p>
            {:else}
              {errorMessage}
            {/if}
          </div>
        {/if}

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

        <button
          type="submit"
          class="btn btn-circle btn-secondary absolute right-2 bottom-4 p-2"
          disabled={isStreaming || isThinking || input === ""}
        >
          <Icon icon={SentIcon} class="opacity-75 hover:opacity-100" />
        </button>
      </div>

      <div class="text-base-content/60 mb-2 text-center text-[10px]">
        Thirty AI can make mistakes. Check important info.
      </div>
    </form>
  </div>
</Modal>
