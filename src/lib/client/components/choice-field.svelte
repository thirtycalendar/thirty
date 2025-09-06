<script lang="ts">
  import {
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
    type Placement
  } from "@floating-ui/dom";
  import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

  import { portal } from "$lib/client/actions/portal";
  import { cn } from "$lib/client/utils/cn";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";

  import { Icon } from "./icons";

  interface Props {
    choiceList: readonly string[];
    value: string;
    class?: string;
    placement?: Placement;
  }

  let {
    choiceList,
    class: classCn,
    value = $bindable(),
    placement = "bottom-start"
  }: Props = $props();

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | null>(null);
  let triggerButtonRef = $state<HTMLButtonElement | null>(null);

  let cleanup: (() => void) | null = null;

  function updatePosition() {
    if (!triggerButtonRef || !dropdownRef) return;
    computePosition(triggerButtonRef, dropdownRef, {
      placement,
      middleware: [offset(6), flip(), shift({ padding: 8 })]
    }).then(({ x, y }) => {
      Object.assign(dropdownRef!.style, {
        left: `${x}px`,
        top: `${y}px`
      });
    });
  }

  $effect(() => {
    if (open && triggerButtonRef && dropdownRef) {
      cleanup = autoUpdate(triggerButtonRef, dropdownRef, updatePosition, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        animationFrame: false
      });
      updatePosition();
    } else {
      cleanup?.();
      cleanup = null;
    }
  });

  function selectChoice(choice: string) {
    if (value === choice) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }
    value = choice;
    open = false;
    setTimeout(() => triggerButtonRef?.focus(), 0);
  }

  function handleClickOutside(event: MouseEvent) {
    if (!open) return;
    const target = event.target as Node;
    if (!dropdownRef?.contains(target) && !triggerButtonRef?.contains(target)) {
      open = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      open = false;
      triggerButtonRef?.focus();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", classCn)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class="input bg-base-100 hover:bg-base-200 border-base-300 flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm outline-none focus:outline-none"
    onclick={() => (open = !open)}
    onkeydown={(e) => {
      if ((e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && !open) {
        e.preventDefault();
        open = true;
        setTimeout(() => {
          const firstOption = dropdownRef?.querySelector<HTMLButtonElement>('[role="option"]');
          firstOption?.focus();
        }, 0);
      }
    }}
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <span>{capitalizeFirstLetter(value ?? choiceList[0])}</span>
    <Icon
      icon={ArrowDown01Icon}
      size={16}
      class={cn("transition-transform", open && "rotate-180")}
      absoluteStrokeWidth
    />
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      use:portal
      class="border-base-300 bg-base-100 border-rounded z-[9999] max-h-60 w-[240px] overflow-y-auto rounded-xl border p-3 shadow-lg"
      role="listbox"
      tabindex="-1"
      style="position: absolute; top: 0; left: 0;"
    >
      <div class="space-y-0.5">
        {#each choiceList as choice (choice)}
          <button
            type="button"
            class={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors focus:outline-none",
              value === choice
                ? "bg-base-200 text-primary-content font-semibold"
                : "hover:bg-base-300/60 focus:bg-base-300/60"
            )}
            onclick={() => selectChoice(choice)}
            role="option"
            aria-selected={value === choice}
            onkeydown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectChoice(choice);
              } else if (e.key === "Escape") {
                e.preventDefault();
                open = false;
                triggerButtonRef?.focus();
              }
            }}
            disabled={value === choice}
          >
            {capitalizeFirstLetter(choice)}
            {#if value === choice}
              <Icon icon={Tick02Icon} size={16} absoluteStrokeWidth />
            {/if}
          </button>
        {/each}

        {#if choiceList.length === 0}
          <div class="text-base-content/60 px-3 py-2 text-sm">No options available.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
