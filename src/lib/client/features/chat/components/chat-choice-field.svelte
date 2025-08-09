<script lang="ts">
  import { Check, ChevronDown } from "@lucide/svelte";

  import { chatModal } from "$lib/client/stores/modal";
  import { cn } from "$lib/client/utils/cn";

  import type { Chat } from "$lib/shared/types";

  interface Props {
    chats: Chat[];
    class?: string;
  }

  let { chats, class: classCn }: Props = $props();

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement>();
  let triggerButtonRef = $state<HTMLButtonElement>();
  const placeholder = "New chat";

  const { currentDetails } = chatModal;

  function selectChat(chat: Chat | null) {
    const current = $currentDetails;

    if (chat && current?.id === chat.id) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }

    currentDetails.set(chat);
    open = false;
    setTimeout(() => triggerButtonRef?.focus(), 0);
  }

  function handleClickOutside(event: MouseEvent) {
    if (!open) return;
    const target = event.target as Node;
    if (!dropdownRef?.contains(target) && !triggerButtonRef?.contains(target)) {
      open = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      open = false;
      triggerButtonRef?.focus();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", classCn)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class={cn(
      "bg-base-100 hover:bg-base-200 border-base-300 flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm outline-none"
    )}
    onclick={() => (open = !open)}
    onkeydown={(e) => {
      if ((e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && !open) {
        e.preventDefault();
        open = true;
      }
    }}
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <span>{$currentDetails ? $currentDetails.name : placeholder}</span>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      class="border-base-300 bg-base-100 absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border p-3 shadow-xl"
      role="listbox"
      tabindex="-1"
    >
      <div class="space-y-0.5">
        <!-- Option to reset to "New chat" -->
        <button
          type="button"
          class={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors focus:outline-none",
            !$currentDetails
              ? "bg-base-200 text-primary-content font-semibold"
              : "hover:bg-base-300/60 focus:bg-base-300/60"
          )}
          onclick={() => selectChat(null)}
          role="option"
          aria-selected={!$currentDetails}
          tabindex="0"
        >
          <span class="flex-1 truncate text-left">{placeholder}</span>
          {#if !$currentDetails}
            <Check size="16" />
          {/if}
        </button>

        {#each chats as chat (chat.id)}
          <button
            type="button"
            class={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors focus:outline-none",
              $currentDetails?.id === chat.id
                ? "bg-base-200 text-primary-content font-semibold"
                : "hover:bg-base-300/60 focus:bg-base-300/60"
            )}
            onclick={() => selectChat(chat)}
            role="option"
            aria-selected={$currentDetails?.id === chat.id}
            tabindex="0"
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectChat(chat);
              } else if (e.key === "Escape") {
                e.preventDefault();
                open = false;
                triggerButtonRef?.focus();
              }
            }}
            disabled={$currentDetails?.id === chat.id}
          >
            <span class="flex-1 truncate text-left">{chat.name}</span>
            {#if $currentDetails?.id === chat.id}
              <Check size="16" />
            {/if}
          </button>
        {/each}

        {#if chats.length === 0}
          <div class="text-base-content/60 px-3 py-2 text-sm">No chat history.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
