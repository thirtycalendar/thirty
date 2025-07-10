<script lang="ts">
  import { Plus } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { eventCreateModalId } from "$lib/client/stores/event";
</script>

<div class="z-1000 hidden sm:block dropdown dropdown-bottom dropdown-end">
  <button tabindex="0" class="btn btn-md bg-primary shadow-none">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 my-1 p-2 border border-base-200"
  >
    <li>
      <button
        onclick={() => {
          toggleModal(eventCreateModalId);
          (document.activeElement as HTMLElement)?.blur();
        }}
      >
        Event
      </button>
    </li>
    <!-- <li>
      <button
        onclick={() => {
          toggleModal(taskCreateModalId);
          (document.activeElement as HTMLElement)?.blur();
        }}
      >
        Task
      </button>
    </li> -->
  </ul>
</div>

<div class="z-100 absolute sm:hidden right-8 bottom-8 dropdown dropdown-top dropdown-end">
  <button tabindex="0" class="btn btn-md bg-base-200 border border-base-300">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 my-1 p-2 border border-base-200"
  >
    <li>
      <button
        onclick={() => {
          toggleModal(eventCreateModalId);
          (document.activeElement as HTMLElement)?.blur();
        }}
      >
        Event
      </button>
    </li>
    <!-- <li>
      <button
        onclick={() => {
          toggleModal(taskCreateModalId);
          (document.activeElement as HTMLElement)?.blur();
        }}
      >
        Task
      </button>
    </li> -->
  </ul>
</div>
