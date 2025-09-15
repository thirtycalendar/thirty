<script lang="ts">
  import { Search01Icon } from "@hugeicons/core-free-icons";

  import { eventsQuery } from "$lib/client/data/queries";
  import { eventModalStore } from "$lib/client/stores/modal";

  import type { Event } from "$lib/shared/types";

  import { Icon } from "../icons";
  import { formatFilteredEventTime } from "./utils";

  const { data: events } = eventsQuery();

  let open = $state(false);
  let query = $state("");
  let containerRef = $state<HTMLDivElement | null>(null);
  let triggerButtonRef = $state<HTMLButtonElement | null>(null);

  function toggleSearch(): void {
    open = !open;
    query = "";
  }

  function getResults(): Event[] {
    if (!$events) return [];
    const q = query.toLowerCase().trim();
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
    toggleSearch();
    eventModalStore.openModal(event);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!containerRef?.contains(target) && !triggerButtonRef?.contains(target)) {
      open = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      open = false;
      triggerButtonRef?.focus();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<button
  class="btn btn-ghost btn-square btn-sm sm:btn-md text-primary-content/70 hover:text-primary-content ml-2"
  onclick={toggleSearch}
  bind:this={triggerButtonRef}
>
  <Icon icon={Search01Icon} class="size-4 sm:size-5" absoluteStrokeWidth />
</button>

{#if open}
  <div
    bind:this={containerRef}
    class="absolute inset-0 top-1/4 z-501 mx-2 flex items-start justify-center"
  >
    <div
      class="bg-base-100 base-border border-rounded mx-2 w-full max-w-lg overflow-hidden shadow-xl"
    >
      <input
        type="text"
        bind:value={query}
        placeholder="Search"
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
                <div class="text-xs opacity-50">
                  {formatFilteredEventTime(event)}
                </div>
              </button>
            </li>
          {/each}
        </ul>
      {:else if query}
        <div class="p-2 text-sm opacity-70">No results</div>
      {/if}
    </div>
  </div>
{/if}
