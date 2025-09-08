<script lang="ts">
  import { onMount } from "svelte";

  import { Message01Icon } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";

  import { Toolbar } from ".";

  let isOpen = $state(true);
  let isMaximize = $state(false);

  function handleClose() {
    isOpen = false;
    isMaximize = false;
  }

  function handleMaximize() {
    isOpen = true;
    isMaximize = !isMaximize;
  }

  function handleMinimize() {
    isOpen = false;
  }

  function handleChatIcon() {
    isOpen = true;
    isMaximize = window.innerWidth < 640;
  }

  function updateMaximize() {
    if (isOpen) {
      isMaximize = window.innerWidth < 640;
    }
  }

  onMount(() => {
    window.addEventListener("resize", updateMaximize);

    return () => window.removeEventListener("resize", updateMaximize);
  });
</script>

<div class="fixed right-8 bottom-8 z-[9999]">
  {#if isOpen}
    <!-- Chat modal -->
    <div
      class={cn(
        "border-base-300 bg-base-200 flex flex-col overflow-hidden rounded-lg border shadow-lg",
        isMaximize
          ? "fixed inset-0 h-screen w-screen"
          : "absolute right-0 bottom-0 min-h-[550px] min-w-[350px]"
      )}
    >
      <div class="bg-base-100 flex min-h-0 flex-1 flex-col rounded-t-lg">
        <!-- Toolbar -->
        <Toolbar {isMaximize} {handleMinimize} {handleMaximize} {handleClose} />

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
