<script lang="ts">
  import type { Writable } from "svelte/store";

  import { ArrowDown01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

  import { cn } from "$lib/client/utils/cn";

  import { Colors } from "$lib/shared/constants";
  import type { Color as ColorType } from "$lib/shared/types";

  import { Icon } from "../icons";

  interface Props {
    name: string;
    class?: string;
    isLeftDiv?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
  }

  let { name, class: classCn, isLeftDiv, formData, formErrors }: Props = $props();

  let selectedColorHex = $derived($formData[name]);
  let error = $derived($formErrors[name]);

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | undefined>(undefined);
  let triggerButtonRef = $state<HTMLButtonElement | undefined>(undefined);

  function selectChoice(choiceHex: ColorType) {
    if (selectedColorHex === choiceHex) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }

    $formData[name] = choiceHex;
    open = false;
    setTimeout(() => triggerButtonRef?.focus(), 0);
  }

  function handleClickOutside(event: MouseEvent): void {
    if (!open) return;
    if (dropdownRef && triggerButtonRef) {
      const target = event.target as Node;
      if (!dropdownRef.contains(target) && !triggerButtonRef.contains(target)) {
        open = false;
      }
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      open = false;
      triggerButtonRef?.focus();
    }
  }

  function handleGridKeydown(event: KeyboardEvent, index: number) {
    const numCols = 6;
    const totalChoices = Colors.length;

    let nextIndex: number | null = null;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        selectChoice(Colors[index]);
        break;
      case "ArrowRight":
        event.preventDefault();
        nextIndex = (index + 1) % totalChoices;
        break;
      case "ArrowLeft":
        event.preventDefault();
        nextIndex = (index - 1 + totalChoices) % totalChoices;
        break;
      case "ArrowDown":
        event.preventDefault();
        nextIndex = index + numCols;
        if (nextIndex >= totalChoices) nextIndex = null;
        break;
      case "ArrowUp":
        event.preventDefault();
        nextIndex = index - numCols;
        if (nextIndex < 0) nextIndex = null;
        break;
      case "Escape":
        event.preventDefault();
        open = false;
        triggerButtonRef?.focus();
        break;
    }

    if (nextIndex !== null && nextIndex >= 0 && nextIndex < totalChoices) {
      const nextButton = dropdownRef?.querySelector(
        `[data-color-id="${Colors[nextIndex]}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", classCn)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class={cn(
      "input bg-base-100 hover:bg-base-200 flex w-full items-center justify-between text-left outline-none focus:outline-none",
      error ? "border-error" : "border-base-300"
    )}
    onclick={() => (open = !open)}
    onkeydown={(e) => {
      if ((e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && !open) {
        e.preventDefault();
        open = true;
        setTimeout(() => {
          const firstColorButton = dropdownRef?.querySelector<HTMLButtonElement>('[role="option"]');
          firstColorButton?.focus();
        }, 0);
      }
    }}
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <div class="flex items-center gap-2">
      {#if selectedColorHex}
        <span
          class="inline-block h-5 w-5 rounded-full"
          style="background-color: {selectedColorHex};"
          aria-label="Selected color preview"
        ></span>
      {/if}
    </div>
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
      class={cn(
        "bg-base-100 border-rounded border-base-300 absolute z-50 mt-1 w-55 rounded-2xl border p-3",
        isLeftDiv ? "left-0" : "right-0"
      )}
      role="listbox"
      tabindex="-1"
    >
      <div class="grid auto-rows-fr grid-cols-6 gap-2">
        {#each Colors as choice, index (choice)}
          <button
            type="button"
            class="hover:ring-base-300 focus:ring-base-300 relative flex aspect-square w-full items-center justify-center
              rounded-full p-0.5 transition-all
              duration-100 ease-in-out outline-none hover:ring-2
              hover:ring-offset-2 focus:ring-2 focus:ring-offset-2"
            style="background-color: {choice}; border: 1px solid {choice};"
            onclick={() => selectChoice(choice)}
            onkeydown={(e) => handleGridKeydown(e, index)}
            role="option"
            aria-selected={selectedColorHex === choice}
            aria-label={`Colors ${choice}`}
            data-color-id={choice}
            disabled={selectedColorHex === choice}
          >
            {#if selectedColorHex === choice}
              <Icon
                icon={Tick02Icon}
                size={16}
                strokeWidth={2}
                class="text-white drop-shadow-sm"
                absoluteStrokeWidth
              />
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if error}
    <p class="text-error mt-1 text-sm">{error || "This field is required"}</p>
  {/if}
</div>
