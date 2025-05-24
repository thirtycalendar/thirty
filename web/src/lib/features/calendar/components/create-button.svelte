<script lang="ts">
  import { Plus } from "@lucide/svelte";
</script>

<div class="z-100 hidden sm:block dropdown dropdown-bottom dropdown-end">
  <button tabindex="0" class="btn btn-md bg-primary shadow-none">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 my-1 p-2 shadow-md"
  >
    <li>
      <button onclick={() => (document.activeElement as HTMLElement)?.blur()}>
        Event
      </button>
    </li>
    <li>
      <button onclick={() => (document.activeElement as HTMLElement)?.blur()}>
        Task
      </button>
    </li>
  </ul>
</div>

<div
  class="z-100 absolute sm:hidden right-8 bottom-8 dropdown dropdown-top dropdown-end"
>
  <button tabindex="0" class="btn btn-md bg-base-200 shadow-sm shadow-base-300">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 my-1 p-2 shadow-md"
  >
    <li>
      <button onclick={() => (document.activeElement as HTMLElement)?.blur()}>
        Event
      </button>
    </li>
    <li>
      <button onclick={() => (document.activeElement as HTMLElement)?.blur()}>
        Task
      </button>
    </li>
  </ul>
</div>
