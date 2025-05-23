<script lang="ts">
  import { Ellipsis } from "@lucide/svelte";
</script>

<div>
  <p>My calendars</p>

  <div class="my-2">
    <div class="flex justify-between items-center">
      <button class="w-full flex items-center gap-2">
        <input type="checkbox" class="checkbox checkbox-xs" />
        <span class="text-sm">Sithu Khant</span>
      </button>

      <div class="z-200 dropdown dropdown-end">
        <button class="btn btn-xs btn-square btn-ghost">
          <Ellipsis size="20px" />
        </button>
        <ul
          class="dropdown-content menu bg-base-200 rounded-box z-1 w-40 my-1 p-1 shadow-md"
        >
          <li>
            <button
              onclick={() => (document.activeElement as HTMLElement)?.blur()}
            >
              Event
            </button>
          </li>
          <li>
            <button
              onclick={() => (document.activeElement as HTMLElement)?.blur()}
            >
              Task
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
