<script lang="ts">
  import {
    Cancel01Icon,
    Message01Icon,
    RectangularIcon,
    Remove01Icon
  } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";

  let isOpen = $state(true);
  let isMaximize = $state(false);
  let isMinimize = $state(true);

  function handleClose() {
    isOpen = false;
    isMaximize = false;
    isMinimize = true;
  }

  function handleMaximize() {
    isOpen = true;
    isMaximize = true;
    isMinimize = false;
  }

  function handleMinimize() {
    isOpen = false;
    isMaximize = false;
    isMinimize = true;
  }

  function handleChatIcon() {
    isOpen = true;
  }
</script>

<div class="fixed right-8 bottom-8 z-[5000]">
  {#if isOpen}
    <!-- Chat modal -->
    <div
      class={cn(
        "border-base-300 bg-base-200 absolute right-0 bottom-0 flex h-screen w-screen flex-col rounded-lg border shadow-lg sm:max-h-[550px] sm:max-w-[350px]"
      )}
    >
      <div class="bg-base-100 flex min-h-0 flex-1 flex-col rounded-t-lg">
        <!-- Toolbar -->
        <div class="flex shrink-0 items-center justify-end p-1">
          <button
            class="btn btn-xs btn-square btn-ghost opacity-65 hover:opacity-100"
            onclick={handleMinimize}
          >
            <Icon icon={Remove01Icon} size={13} absoluteStrokeWidth />
          </button>
          <button
            class="btn btn-xs btn-square btn-ghost opacity-65 hover:opacity-100"
            onclick={handleMaximize}
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
        <div class="flex-1 overflow-y-auto px-1"></div>
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
