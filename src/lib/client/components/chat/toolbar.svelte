<script lang="ts">
  import {
    ArrowShrink02Icon,
    Cancel01Icon,
    RectangularIcon,
    Remove01Icon
  } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";

  interface Props {
    isMaximize: boolean;
    handleMinimize: () => void;
    handleMaximize: () => void;
    handleClose: () => void;
  }

  const { isMaximize = $bindable(), handleMinimize, handleMaximize, handleClose }: Props = $props();
</script>

<div class="flex shrink-0 items-center justify-end p-1">
  <button
    class={cn(
      "btn btn-square btn-ghost opacity-65 hover:opacity-100",
      isMaximize ? "btn-md" : "btn-sm"
    )}
    onclick={handleMinimize}
  >
    <Icon icon={Remove01Icon} class={cn(isMaximize ? "size-4" : "size-3")} absoluteStrokeWidth />
  </button>
  <button
    class={cn(
      "btn btn-square btn-ghost hidden opacity-65 hover:opacity-100 sm:flex",
      isMaximize ? "btn-md" : "btn-sm"
    )}
    onclick={handleMaximize}
  >
    {#if isMaximize}
      <Icon
        icon={ArrowShrink02Icon}
        class={cn(isMaximize ? "size-4" : "size-3")}
        absoluteStrokeWidth
      />
    {:else}
      <Icon
        icon={RectangularIcon}
        class={cn(isMaximize ? "size-4" : "size-3")}
        absoluteStrokeWidth
      />
    {/if}
  </button>
  <button
    class={cn(
      "btn btn-square btn-ghost opacity-65 hover:opacity-100",
      isMaximize ? "btn-md" : "btn-sm"
    )}
    onclick={handleClose}
  >
    <Icon icon={Cancel01Icon} class={cn(isMaximize ? "size-4" : "size-3")} absoluteStrokeWidth />
  </button>
</div>
