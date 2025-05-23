<script lang="ts">
  import { Bolt } from "@lucide/svelte";

  const calendars = [
    { name: "Sithu Khant", color: "text-blue-400" },
    { name: "Work", color: "text-green-400" },
    { name: "Focus", color: "text-purple-400" },
    { name: "Family", color: "text-pink-400" },
  ];
</script>

<div class="my-1">
  <p class="px-1 text-sm font-semibold">My calendars</p>

  <div class="my-1">
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
</div>
