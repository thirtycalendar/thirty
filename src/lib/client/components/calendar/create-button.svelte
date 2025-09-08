<script lang="ts">
  import { Add01Icon } from "@hugeicons/core-free-icons";

  import { toggleDraggableModal } from "$lib/client/components/utils";
  import { eventModalStore } from "$lib/client/stores/modal";

  import { Icon } from "../icons";
</script>

<div class="z-200">
  <button
    class="btn btn-sm sm:btn-md bg-primary border-base-300 border"
    onclick={() => {
      toggleDraggableModal(eventModalStore.modalId);
    }}
  >
    <Icon icon={Add01Icon} />
    <span class="hidden lg:block">Create</span>
  </button>
</div>
