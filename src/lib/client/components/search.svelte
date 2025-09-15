<script lang="ts">
  import { tick } from "svelte";

  import { eventsQuery } from "$lib/client/data/queries";
  import { eventModalStore } from "$lib/client/stores/modal";
  import {
    hideSearch,
    isSearchOpen,
    searchQuery,
    searchTriggered
  } from "$lib/client/stores/search";

  import type { Event } from "$lib/shared/types";

  import { formatFilteredEventTime } from "./event/utils";

  let inputRef = $state<HTMLDivElement | null>(null);
  let containerRef = $state<HTMLDivElement | null>(null);

  const { data: events } = eventsQuery();

  function getResults(): Event[] {
    if (!$events) return [];
    const q = $searchQuery.toLowerCase().trim();
    if (!q) return [];

    return $events
      .filter((e) =>
        [e.name, e.description ?? "", e.location ?? ""].some((field) =>
          field.toLowerCase().includes(q)
        )
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }

  function handleClick(event: Event) {
    hideSearch();
    eventModalStore.openModal(event);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (!containerRef?.contains(target) && !$searchTriggered) {
      hideSearch();
    }

    searchTriggered.set(false);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") hideSearch();
  }

  $effect(() => {
    if ($isSearchOpen && inputRef) {
      tick().then(() => inputRef?.focus());
    }
  });
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

{#if $isSearchOpen}
  <div
    bind:this={containerRef}
    class="absolute inset-0 top-1/4 z-9997 mx-2 flex items-start justify-center"
  >
    <div
      class="bg-base-100 base-border border-rounded mx-2 w-full max-w-lg overflow-hidden shadow-xl"
    >
      <input
        type="text"
        bind:value={$searchQuery}
        placeholder="Search"
        bind:this={inputRef}
        class="input input-lg sm:input-xl w-full rounded-none border-none focus:outline-0"
      />

      {#if getResults().length > 0}
        <ul class="max-h-80 space-y-2 overflow-y-auto">
          {#each getResults() as event (event.id)}
            <li>
              <button
                class="hover:bg-base-200 w-full cursor-pointer p-2 px-3 text-start"
                onclick={() => handleClick(event)}
              >
                <div class="text-sm font-medium sm:text-base">{event.name}</div>
                <div class="text-xs opacity-50">{formatFilteredEventTime(event)}</div>
              </button>
            </li>
          {/each}
        </ul>
      {:else if $searchQuery}
        <div class="p-2 text-sm opacity-70">No results</div>
      {/if}
    </div>
  </div>
{/if}
