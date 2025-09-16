<script lang="ts">
  import Markdown from "svelte-markdown";

  import { Chat } from "@ai-sdk/svelte";
  import { SentIcon } from "@hugeicons/core-free-icons";

  import { checkoutMutation } from "$lib/client/data/mutations";
  import {
    birthdaysQuery,
    calendarsQuery,
    chatsQuery,
    eventsQuery,
    getMessagesQuery,
    userHolidayCountriesQuery
  } from "$lib/client/data/queries";
  import { creditsQuery } from "$lib/client/data/queries/credit";
  import { cn } from "$lib/client/utils/cn";

  import { ChatGreetings, MAX_INPUT_LENGTH } from "$lib/shared/constants";

  import { Icon } from "../icons";
  import { activeChatId, isMaximize } from "./utils";

  import { Modal } from ".";

  let input = $state("");
  let errorMessage = $state("");
  let isToolCalling = $state(false);

  let textareaRef: HTMLTextAreaElement | null = null;

  const { mutate: handleUpgrade } = checkoutMutation();

  const { data: messages, isPending } = $derived.by(() => getMessagesQuery($activeChatId));

  const chats = chatsQuery();
  const credits = creditsQuery();
  const calendars = calendarsQuery();
  const events = eventsQuery();
  const birthdays = birthdaysQuery();
  const userHolidayCountries = userHolidayCountriesQuery();

  let toolsCalled = $state(new Set<string>());

  const generatedChatId = crypto.randomUUID();

  const chat = $derived.by(() => {
    return new Chat({
      id: $activeChatId === "" ? generatedChatId : $activeChatId,
      messages: $messages?.map((m) => ({
        id: m.id,
        role: m.role,
        createdAt: m.createdAt,
        parts: [{ type: "text" as const, text: m.text }]
      })),
      onToolCall: (tool) => {
        isToolCalling = true;
        toolsCalled.add(tool.toolCall.toolName);
      },
      onFinish: async () => {
        activeChatId.set(generatedChatId);
        isToolCalling = false;

        chats.refetch();
        credits.refetch();

        const names = [...toolsCalled];
        if (names.some((n) => n.toLowerCase().includes("calendar"))) calendars.refetch();
        if (names.some((n) => n.toLowerCase().includes("event"))) events.refetch();
        if (names.some((n) => n.toLowerCase().includes("birthday"))) birthdays.refetch();
        if (names.some((n) => n.toLowerCase().includes("holiday"))) userHolidayCountries.refetch();

        toolsCalled.clear();
      },
      onError: (error) => {
        try {
          const data = typeof error.message === "string" ? JSON.parse(error.message) : error;
          errorMessage =
            data.message?.split("\n")[0].replace(/^Error:\s*/, "") ?? "Something went wrong.";
        } catch {
          errorMessage =
            error.message?.split("\n")[0].replace(/^Error:\s*/, "") ?? "Something went wrong.";
        }
      }
    });
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
    errorMessage = "";

    if (!input.trim() || isThinking || isStreaming) return;

    if (input.length > MAX_INPUT_LENGTH) {
      errorMessage = `Maximum ${MAX_INPUT_LENGTH} characters allowed.`;
      return;
    }

    chat.sendMessage({ text: input });
    input = "";
    if (textareaRef) textareaRef.style.height = "auto";
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onsubmit(e);
    }
  }

  const greeting = ChatGreetings[Math.floor(Math.random() * ChatGreetings.length)];
</script>

<Modal>
  <div class="flex h-full flex-col">
    <!-- Messages -->
    <div class="flex-1 overflow-y-auto">
      {#if $isPending}
        <span
          class={cn(
            $isMaximize ? "loading-sm" : "loading-xs",
            "text-primary-content/50 loading loading-spinner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          )}
        ></span>
      {:else}
        <div
          class={cn(
            $isMaximize ? "text-base" : "text-sm",
            "text-primary-content/80 mx-auto w-full max-w-3xl p-2"
          )}
        >
          {#if chat.messages.length === 0}
            <div
              class={cn(
                $isMaximize ? "bottom-35" : "bottom-28",
                "absolute left-1/2 w-full -translate-x-1/2 -translate-y-2/3 text-center"
              )}
            >
              <h2
                class={cn(
                  $isMaximize ? "text-2xl" : "text-lg",
                  "text-primary-content/65 font-medium"
                )}
              >
                {greeting}
              </h2>
            </div>
          {:else}
            {#each chat.messages as message, i (i)}
              <div
                class={cn("my-2 flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {#each message.parts as part, i (i)}
                  {#if part.type === "text"}
                    {#if message.role === "user"}
                      <!-- User message -->
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

            <div class="my-4 animate-pulse">
              {#if isThinking}
                Thinking...
              {:else if isStreaming && isToolCalling}
                ...
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Input -->
    <form {onsubmit} class="sticky bottom-0 w-full p-1 pt-0">
      <div class="relative mx-auto w-full max-w-3xl">
        {#if errorMessage}
          <div
            class={cn(
              "alert alert-error border-rounded border-base-300 text-base-content/75 my-2 w-full p-2",
              $isMaximize ? "text-base" : "text-sm"
            )}
          >
            {#if errorMessage.includes("No credits left")}
              <p>
                <button
                  class="cursor-pointer font-medium underline"
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
