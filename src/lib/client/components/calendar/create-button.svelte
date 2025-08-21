<script lang="ts">
  import { Add01Icon } from "@hugeicons/core-free-icons";

  import { toggleModal } from "$lib/client/components/utils";
  import { eventModalStore } from "$lib/client/stores/modal";

  import { Icon } from "../icons";
</script>

<div class="z-200 hidden sm:block">
  <button
    class="btn btn-md bg-primary border-base-300 border shadow-none"
    onclick={() => {
      toggleModal(eventModalStore.modalId);
    }}
  >
    <Icon icon={Add01Icon} />
    <span class="hidden lg:block">Create</span>
  </button>
</div>

<div class="absolute right-8 bottom-8 z-200 sm:hidden">
  <button
    class="btn btn-md bg-base-200 border-base-300 border"
    onclick={() => {
      toggleModal(eventModalStore.modalId);
    }}
  >
    <Icon icon={Add01Icon} />
  </button>
</div>
