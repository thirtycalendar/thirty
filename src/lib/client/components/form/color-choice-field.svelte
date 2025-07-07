<script lang="ts">
  import type { Writable } from "svelte/store";

  import { Check, ChevronDown } from "@lucide/svelte";

  import { cn } from "$lib/client/utils/cn";

  import { colors } from "$lib/shared/utils/colors";
  import type { Color } from "$lib/shared/types";

  interface ColorChoiceFieldProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    className?: string;
    isLeftDiv?: boolean;
  }

  let { name, formData, className, isLeftDiv }: ColorChoiceFieldProps = $props();

  let colorId = $derived($formData[name]);
  let selectedColor: Color | undefined = $derived(colors.find((c) => c.id === colorId));

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | undefined>(undefined);
  let triggerButtonRef = $state<HTMLButtonElement | undefined>(undefined);

  function selectChoice(choice: Color) {
    if (colorId === choice.id) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }

    $formData[name] = choice.id;
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
    const totalChoices = colors.length;

    let nextIndex: number | null = null;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        selectChoice(colors[index]);
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
        `[formData-color-id="${colors[nextIndex].id}"]`
      ) as HTMLButtonElement;
      nextButton?.focus();
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", className)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class="w-full px-3 py-2 border rounded-md text-sm bg-base-100 hover:bg-base-200 text-left flex justify-between items-center border-base-300 outline-none"
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
      {#if selectedColor}
        <span
          class="inline-block w-5 h-5 rounded-full"
          style="background-color: {selectedColor.colorHexCode};"
          aria-label="Selected color preview"
        ></span>
      {/if}
    </div>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      class={`absolute ${isLeftDiv ? "left-0" : "right-0"} mt-1 z-50 w-35 rounded-xl border border-base-300 bg-base-100 shadow-xl p-3`}
      role="listbox"
      tabindex="-1"
    >
      <div class="grid grid-cols-4 gap-2 auto-rows-fr">
        {#each colors as choice, index (choice.id)}
          <button
            type="button"
            class="relative w-full aspect-square rounded-full flex items-center justify-center p-0.5
              hover:ring-2 hover:ring-offset-2 hover:ring-base-300
              focus:ring-2 focus:ring-offset-2 focus:ring-base-300 outline-none
              transition-all duration-100 ease-in-out"
            style="background-color: {choice.colorHexCode}; border: 1px solid {choice.colorHexCode};"
            onclick={() => selectChoice(choice)}
            onkeydown={(e) => handleGridKeydown(e, index)}
            role="option"
            aria-selected={colorId === choice.id}
            aria-label={`Color ${choice.id}`}
            data-color-id={choice.id}
            disabled={colorId === choice.id}
          >
            {#if colorId === choice.id}
              <Check size="16" strokeWidth="4" class="text-base-200 drop-shadow-sm" />
            {/if}
          </button>
        {/each}
        {#if colors.length === 0}
          <div class="col-span-full px-3 py-2 text-sm text-base-content/60 text-center">
            No colors available.
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
