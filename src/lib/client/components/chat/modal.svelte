<script lang="ts">
  import {
    Cancel01Icon,
    Message01Icon,
    RectangularIcon,
    Remove01Icon
  } from "@hugeicons/core-free-icons";

  import { Icon } from "../icons";

  let isOpen = $state(true);
  // let isMinimize = $state(false);

  function handleClose() {
    isOpen = false;
  }

  function handleChatIcon() {
    isOpen = true;
  }
</script>

<div class="fixed right-8 bottom-8 z-[5000]">
  {#if isOpen}
    <!-- Chat modal -->
    <div
      class="border-rounded bg-base-200 border-base-300 absolute right-0 bottom-0 h-screen w-screen border p-0.5 shadow-lg sm:max-h-[550px] sm:max-w-[350px]"
    >
      <div class="bg-base-100 border-rounded max-h-full w-full">
        <!-- Toolbar -->
        <div class="flex w-full cursor-all-scroll items-center justify-end p-1">
          <button
            class="btn btn-xs btn-square btn-ghost opacity-65 hover:opacity-100"
            onclick={handleClose}
          >
            <Icon icon={Remove01Icon} size={13} absoluteStrokeWidth />
          </button>

          <button
            class="btn btn-xs btn-square btn-ghost opacity-65 hover:opacity-100"
            onclick={handleClose}
          >
            <Icon icon={RectangularIcon} size={13} absoluteStrokeWidth />
          </button>

          <button
            class="btn btn-xs btn-square btn-ghost opacity-65 hover:opacity-100"
            onclick={handleClose}
          >
            <Icon icon={Cancel01Icon} size={13} absoluteStrokeWidth />
          </button>
        </div>

        <!-- Chat container -->
        <div class="max-h-full overflow-y-scroll px-1">Content</div>
      </div>
    </div>
  {/if}

  <!-- Chat icon -->
  <button
    class="btn btn-lg bg-primary border-base-300 btn-square border shadow-lg"
    onclick={handleChatIcon}
  >
    <Icon icon={Message01Icon} absoluteStrokeWidth />
  </button>
</div>
