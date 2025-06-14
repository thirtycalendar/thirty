<script lang="ts">
  import { Check, ChevronDown } from "@lucide/svelte";

  import { cn } from "$lib/client/utils/cn"; // Assuming this utility is still available

  import type { Color, ColorMap } from "$lib/types"; // Import Color and ColorMap types

  interface ColorChoiceFieldProps {
    name: string;
    choiceList: Color;
    placeholder?: string;
    className?: string;
    formData: any;
    formErrors: any;
    handleInput: (event: Event) => void;
  }

  let {
    name,
    choiceList, // This is the full Color object
    placeholder,
    className,
    formData,
    formErrors,
    handleInput
  }: ColorChoiceFieldProps = $props();

  let value: string | undefined = $derived($formData[name]);

  // Derive the list of event colors for display in the dropdown
  const eventColorMap: ColorMap = $derived(choiceList?.event || {});
  const filteredChoiceList: { id: string; background: string; foreground: string }[] = $derived(
    Object.entries(eventColorMap).map(([id, colors]) => ({
      id,
      background: colors.background,
      foreground: colors.foreground
    }))
  );

  // Derive the currently selected color object based on `value`
  let selectedColor: { id: string; background: string; foreground: string } | undefined = $derived(
    filteredChoiceList.find((c) => c.id === value)
  );

  let error = $derived($formErrors[name]);

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | undefined>(undefined);
  let triggerButtonRef = $state<HTMLButtonElement | undefined>(undefined);

  // The displayed summary for the trigger button
  const displayedSummary = $derived(() => {
    if (selectedColor) {
      // For colors, the "summary" is essentially the color itself,
      // but we can just use the placeholder or a generic "Selected Color"
      // or the ID if we want to be explicit.
      // For simplicity, let's show "Color <ID>" or the placeholder.
      return `Color ${selectedColor.id}`;
    }
    return placeholder || "Select a color";
  });

  function selectChoice(choice: { id: string; background: string; foreground: string }) {
    // PREVENT DESELECTION: If the clicked choice is already selected, just close the dropdown
    if (value === choice.id) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return; // Do nothing else
    }

    // SELECT the new choice
    const newValue = choice.id;

    $formData[name] = newValue; // Update the Svelte store directly

    // Mimic native input event for `handleInput`
    const mockEvent = new Event("input", { bubbles: true });
    const mockTarget = {
      name: name,
      value: newValue,
      type: "text" // Treat as a text input for generic handling
    };
    Object.defineProperty(mockEvent, "target", { writable: false, value: mockTarget });

    handleInput(mockEvent); // Call the form's handleInput

    open = false; // Close the dropdown
    setTimeout(() => triggerButtonRef?.focus(), 0); // Focus back on trigger
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
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", className)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class="w-full px-3 py-2 border rounded-md text-sm bg-base-100 hover:bg-base-200 text-left flex justify-between items-center
      {error ? 'border-error' : 'border-base-300'} outline-none"
    onclick={() => (open = !open)}
    onkeydown={(e) => {
      if ((e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && !open) {
        e.preventDefault();
        open = true;
      }
    }}
    aria-haspopup="listbox"
    aria-expanded={open}
  >
    <div class="flex items-center gap-2">
      {#if selectedColor}
        <span
          class="inline-block w-4 h-4 rounded-full"
          style="background-color: {selectedColor.background};"
          aria-label="Selected color preview"
        ></span>
      {/if}
      <span>{displayedSummary()}</span>
    </div>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if error}
    <p class="text-error text-xs mt-1">{error}</p>
  {/if}

  {#if open}
    <div
      bind:this={dropdownRef}
      class="absolute mt-1 z-50 w-full rounded-xl border border-base-300 bg-base-100 shadow-xl max-h-60 overflow-y-auto p-3"
      role="listbox"
      tabindex="-1"
    >
      <div class="space-y-0.5">
        {#each filteredChoiceList as choice (choice.id)}
          <button
            type="button"
            class="flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md transition-colors
              {value === choice.id ? 'bg-base-200 text-primary-content font-semibold' : ''}
              hover:bg-base-300/60 focus:bg-base-300/60 focus:outline-none"
            onclick={() => selectChoice(choice)}
            role="option"
            aria-selected={value === choice.id}
            tabindex="0"
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
            disabled={value === choice.id}
          >
            <div class="flex items-center gap-2">
              <span
                class="inline-block w-4 h-4 rounded-full"
                style="background-color: {choice.background};"
                aria-label="Color preview"
              ></span>
              <span>Color {choice.id}</span>
            </div>
            {#if value === choice.id}
              <Check size="16" />
            {/if}
          </button>
        {/each}
        {#if filteredChoiceList.length === 0}
          <div class="px-3 py-2 text-sm text-base-content/60">No event colors available.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
