<script lang="ts">
  import {
    Cancel01Icon,
    Message01Icon,
    RectangularIcon,
    Remove01Icon
  } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";

  let isOpen = $state(false);
  let isMaximize = $state(false);

  function handleClose() {
    isOpen = false;
    isMaximize = false;
  }

  function handleMaximize() {
    isOpen = true;
    isMaximize = true;
  }

  function handleMinimize() {
    isOpen = false;
    isMaximize = false;
  }

  function handleChatIcon() {
    isOpen = true;
    isMaximize = false;
  }
</script>

<div class="fixed z-[9999]" class:right-8={!isMaximize} class:bottom-8={!isMaximize}>
  {#if isOpen}
    <!-- Chat modal -->
    <div
      class={cn(
        "border-base-300 bg-base-200 flex flex-col overflow-hidden rounded-lg border shadow-lg",
        isMaximize
          ? "fixed inset-0 h-screen w-screen"
          : "absolute right-0 bottom-0 h-screen w-screen sm:max-h-[550px] sm:max-w-[350px]"
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
