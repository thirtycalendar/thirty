<script lang="ts">
  import { toggleModal } from "$lib/client/components/utils";
  import { eventModal } from "$lib/client/stores/modal";

  import { Plus } from "../icons";
</script>

<div class="z-200 hidden sm:block">
  <button
    tabindex="0"
    class="btn btn-md bg-primary border-base-300 border shadow-none"
    onclick={() => {
      toggleModal(eventModal.modalId);
      (document.activeElement as HTMLElement)?.blur();
    }}
  >
    <Plus size="20" /> <span class="hidden lg:block">Create</span>
  </button>
</div>

<div class="absolute right-8 bottom-8 z-200 sm:hidden">
  <button tabindex="0" class="btn btn-md bg-base-200 border-base-300 border">
    <Plus size="20px" /> <span class="hidden lg:block">Create</span>
  </button>
</div>
