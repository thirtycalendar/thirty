<script lang="ts">
  import {
    Add01Icon,
    ArrowShrink02Icon,
    Cancel01Icon,
    DashboardSquare01Icon,
    RectangularIcon,
    Remove01Icon,
    TransactionHistoryIcon
  } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";
  import { isMaximize } from "./utils";

  interface Props {
    handleMinimize: () => void;
    handleMaximize: () => void;
    handleClose: () => void;
  }

  const { handleMinimize, handleMaximize, handleClose }: Props = $props();
</script>

<div class="flex shrink-0 items-center justify-between p-1">
  <div class="flex items-center">
    <button
      class={cn(
        "btn btn-square btn-ghost opacity-90 hover:opacity-100",
        $isMaximize ? "btn-md" : "btn-sm"
      )}
      onclick={handleClose}
    >
      <Icon
        icon={DashboardSquare01Icon}
        class={cn($isMaximize ? "size-4" : "size-3")}
        absoluteStrokeWidth
      />
    </button>

    <button
      class={cn(
        "btn btn-square btn-ghost opacity-90 hover:opacity-100",
        $isMaximize ? "btn-md" : "btn-sm"
      )}
      onclick={handleClose}
    >
      <Icon
        icon={TransactionHistoryIcon}
        class={cn($isMaximize ? "size-4" : "size-3")}
        absoluteStrokeWidth
      />
    </button>
    <button
      class={cn(
        "btn btn-square btn-ghost opacity-90 hover:opacity-100",
        $isMaximize ? "btn-md" : "btn-sm"
      )}
      onclick={handleClose}
    >
      <Icon icon={Add01Icon} class={cn($isMaximize ? "size-4" : "size-3")} absoluteStrokeWidth />
    </button>
  </div>

  <div class="flex items-center">
    <button
      class={cn(
        "btn btn-square btn-ghost opacity-65 hover:opacity-100",
        $isMaximize ? "btn-md" : "btn-sm"
      )}
      onclick={handleMinimize}
    >
      <Icon icon={Remove01Icon} class={cn($isMaximize ? "size-4" : "size-3")} absoluteStrokeWidth />
    </button>
    <button
      class={cn(
        "btn btn-square btn-ghost hidden opacity-65 hover:opacity-100 sm:flex",
        $isMaximize ? "btn-md" : "btn-sm"
      )}
      onclick={handleMaximize}
    >
      {#if $isMaximize}
        <Icon
          icon={ArrowShrink02Icon}
          class={cn($isMaximize ? "size-4" : "size-3")}
          absoluteStrokeWidth
        />
      {:else}
        <Icon
          icon={RectangularIcon}
          class={cn($isMaximize ? "size-4" : "size-3")}
          absoluteStrokeWidth
        />
      {/if}
    </button>
    <button
      class={cn(
        "btn btn-square btn-ghost opacity-65 hover:opacity-100",
        $isMaximize ? "btn-md" : "btn-sm"
      )}
      onclick={handleClose}
    >
      <Icon icon={Cancel01Icon} class={cn($isMaximize ? "size-4" : "size-3")} absoluteStrokeWidth />
    </button>
  </div>
</div>
