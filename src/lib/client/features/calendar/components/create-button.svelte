<script lang="ts">
  import { Plus } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { eventModal } from "$lib/client/stores/modal";
</script>

<div class="dropdown dropdown-bottom dropdown-end z-200 hidden sm:block">
  <button tabindex="0" class="btn btn-md bg-primary shadow-none">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box border-base-200 z-1 my-1 w-40 border p-2"
  >
    <li>
      <button
        onclick={() => {
          toggleModal(eventModal.modalId);
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

<div class="dropdown dropdown-top dropdown-end absolute right-8 bottom-8 z-100 sm:hidden">
  <button tabindex="0" class="btn btn-md bg-base-200 border-base-300 border">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
  <ul
    class="dropdown-content menu bg-base-100 rounded-box border-base-200 z-1 my-1 w-40 border p-2"
  >
    <li>
      <button
        onclick={() => {
          toggleModal(eventModal.modalId);
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
