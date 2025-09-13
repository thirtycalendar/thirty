<script lang="ts">
  import { onMount, tick, type Snippet } from "svelte";
  import { browser } from "$app/environment";

  import { Message01Icon } from "@hugeicons/core-free-icons";

  import { draggable, type DragPos } from "$lib/client/actions/draggable";
  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";
  import { activeChatId, isMaximize, isOpen } from "./utils";

  import { Toolbar } from ".";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();

  let chatEl: HTMLDivElement | undefined = $state();
  let toolbarEl: HTMLDivElement | undefined = $state();
  let defaultPosition: DragPos = { x: 0, y: 0 };
  let position: DragPos = $state({ ...defaultPosition });

  let draggableAction: ReturnType<typeof draggable> | null = null;

  function resetPosition() {
    position = { ...defaultPosition };
  }

  function handleClose() {
    isOpen.set(false);
    isMaximize.set(false);
    resetPosition();

    activeChatId.set("");
  }

  function handleMinimize() {
    isOpen.set(false);
  }

  async function handleMaximize() {
    isOpen.set(true);
    isMaximize.update((v) => !v);

    if ($isMaximize) {
      position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    } else {
      resetPosition();
    }

    await tick();
    updateDraggable();
  }

  async function handleChatIcon() {
    isOpen.set(true);

    isMaximize.set(browser && window.innerWidth < 640);

    await tick();

    if (!$isMaximize && chatEl) {
      const rect = chatEl.getBoundingClientRect();
      defaultPosition = {
        x: window.innerWidth - rect.width / 2 - 10,
        y: window.innerHeight - rect.height / 2 - 10
      };
      position = { ...defaultPosition };
    } else if ($isMaximize) {
      position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    updateDraggable();
  }

  function updateMaximize() {
    if ($isOpen && browser) {
      const wasMaximize = $isMaximize;
      isMaximize.set(window.innerWidth < 640);

      if ($isMaximize !== wasMaximize) {
        updateDraggable();
      }
    }
  }

  function updateDraggable() {
    if (!chatEl) return;

    draggableAction?.destroy();
    draggableAction = null;

    if (!$isOpen || $isMaximize) return;

    draggableAction = draggable(chatEl, {
      handle: toolbarEl,
      boundary: "window",
      position,
      onDrag: (p) => (position = p)
    });
  }

  onMount(() => {
    if (browser && chatEl) {
      const rect = chatEl.getBoundingClientRect();
      defaultPosition = {
        x: window.innerWidth - rect.width / 2 - 15,
        y: window.innerHeight - rect.height / 2 - 15
      };
      position = { ...defaultPosition };
      updateDraggable();
    }

    window.addEventListener("resize", updateMaximize);
    return () => window.removeEventListener("resize", updateMaximize);
  });
</script>

<div class="fixed z-[9998]">
  {#if $isOpen}
    <div
      bind:this={chatEl}
      class={cn(
        "base-border bg-base-200 border-rounded z-[9999] flex flex-col overflow-hidden p-1 shadow-lg",
        $isMaximize ? "fixed inset-0 h-screen w-screen" : "fixed h-[550px] w-[350px]"
      )}
      style="
        left: {position?.x ?? 0}px;
        top: {position?.y ?? 0}px;
        transform: translate(-50%, -50%);
      "
    >
      <div class="bg-base-100 border-rounded flex min-h-0 flex-1 flex-col">
        <div
          bind:this={toolbarEl}
          class={cn($isMaximize ? "!cursor-default" : "!cursor-all-scroll")}
        >
          <Toolbar {handleMinimize} {handleMaximize} {handleClose} />
        </div>
        <div class="flex-1 overflow-y-auto px-1">
          {@render children()}
        </div>
      </div>
    </div>
  {/if}

  <button
    class="btn btn-lg bg-primary base-border btn-square fixed right-8 bottom-8 shadow-lg"
    onclick={handleChatIcon}
  >
    <Icon icon={Message01Icon} absoluteStrokeWidth />
  </button>
</div>
