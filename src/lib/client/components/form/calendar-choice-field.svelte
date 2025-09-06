<script lang="ts">
  import type { Writable } from "svelte/store";

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

  import type { Calendar } from "$lib/shared/types";

  import { Icon } from "../icons";

  interface Props {
    name: string;
    calendars: Calendar[];
    placeholder?: string;
    class?: string;
    placement?: Placement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
  }

  let {
    name,
    calendars,
    placeholder = "Select a calendar",
    class: classCn,
    formData,
    formErrors,
    placement = "bottom-start"
  }: Props = $props();

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | null>(null);
  let triggerButtonRef = $state<HTMLButtonElement | null>(null);

  let selectedCalendar = $derived.by(() => calendars.find((c) => c.id === $formData[name]));
  let error = $derived($formErrors[name]);

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

  function selectChoice(choice: Calendar) {
    if ($formData[name] === choice.id) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }
    $formData[name] = choice.id;
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
    class={cn(
      "input bg-base-100 hover:bg-base-200 flex  items-center justify-between border text-left outline-none focus:outline-none",
      error ? "border-error text-error" : "border-base-300"
    )}
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
    <span>{$formData[name] ? selectedCalendar?.name : placeholder}</span>
    <Icon
      icon={ArrowDown01Icon}
      size={16}
      class={cn("transition-transform", open && "rotate-180")}
      absoluteStrokeWidth
    />
  </button>

  {#if error}
    <p class="text-error mt-1 text-xs">{error || "This field is required"}</p>
  {/if}

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
        {#each calendars as choice (choice.id)}
          <button
            type="button"
            class={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors focus:outline-none",
              $formData[name] === choice.id
                ? "bg-base-200 text-primary-content font-semibold"
                : "hover:bg-base-300/60 focus:bg-base-300/60"
            )}
            onclick={() => selectChoice(choice)}
            role="option"
            aria-selected={$formData[name] === choice.id}
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
            disabled={$formData[name] === choice.id}
          >
            {choice.name}
            {#if $formData[name] === choice.id}
              <Icon icon={Tick02Icon} size={16} absoluteStrokeWidth />
            {/if}
          </button>
        {/each}

        {#if calendars.length === 0}
          <div class="text-base-content/60 px-3 py-2 text-sm">No calendars available.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
