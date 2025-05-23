<script lang="ts">
  import { Bolt, ChevronDown, Plus } from "@lucide/svelte";
  import { slide } from "svelte/transition";

  const calendars = [
    { name: "Sithu Khant", color: "text-blue-400" },
    { name: "Work", color: "text-green-400" },
    { name: "Focus", color: "text-purple-400" },
    { name: "Family", color: "text-pink-400" },
  ];

  let showCalendars = $state(true);
</script>

<div class="my-1">
  <div
    class="flex items-center justify-between gap-1 px-1 text-sm font-semibold w-full rounded-md"
  >
    <p>My calendars</p>

    <div>
      <button class="btn btn-xs btn-ghost btn-square">
        <Plus size="16" />
      </button>

      <button
        class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${showCalendars && "rotate-180"}`}
        onclick={() => (showCalendars = !showCalendars)}
      >
        <ChevronDown size="16" />
      </button>
    </div>
  </div>

  {#if showCalendars}
    <div class="my-1" transition:slide>
      {#each calendars as { name, color }}
        <label
          class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md"
        >
          <div class="flex items-center gap-2">
            <input type="checkbox" class="checkbox checkbox-xs" />
            <span class={`text-sm ${color}`}>{name}</span>
          </div>
          <button
            class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
          >
            <Bolt size="15" />
          </button>
        </label>
      {/each}
    </div>
  {/if}
</div>
