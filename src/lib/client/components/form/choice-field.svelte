<script lang="ts">
  import { Check, ChevronDown } from "@lucide/svelte";

  import { cn } from "$lib/client/utils/cn";

  import type { Calendar } from "$lib/types";

  interface CalendarChoiceFieldProps {
    name: string;
    choiceList: Calendar[];
    placeholder?: string;
    className?: string;
    formData: any;
    formErrors: any;
    handleInput: (event: Event) => void;
  }

  let {
    name,
    choiceList,
    placeholder,
    className,
    formData,
    formErrors,
    handleInput
  }: CalendarChoiceFieldProps = $props();

  let value: Calendar | undefined = $derived($formData[name]);
  let error = $derived($formErrors[name]);

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | undefined>(undefined);
  let triggerButtonRef = $state<HTMLButtonElement | undefined>(undefined);

  function selectChoice(choice: Calendar) {
    if (value?.id === choice.id) {
      $formData[name] = undefined;
    } else {
      $formData[name] = choice;
    }
    open = false;
    const event = new CustomEvent("input", {
      detail: {
        name,
        value: $formData[name]
      },
      bubbles: true,
      composed: true
    });
    triggerButtonRef?.dispatchEvent(event);
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
    // Add arrow key navigation within the dropdown if desired (more complex)
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", className)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class="w-full px-3 py-2 border rounded-md text-sm bg-base-100 hover:bg-base-200 text-left flex justify-between items-center
      {error ? 'border-error' : 'border-base-300'}"
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
    <span>{value ? value.summary : placeholder || "Select a calendar"}</span>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if error}
    <p class="text-error text-xs mt-1">{error}</p>
  {/if}

  {#if open}
    <div
      bind:this={dropdownRef}
      class="absolute mt-1 z-50 w-full rounded-xl border border-base-300 bg-base-100 shadow-xl max-h-60 overflow-y-auto"
      role="listbox"
      tabindex="-1"
    >
      {#each choiceList as choice (choice.id)}
        <button
          type="button"
          class="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-base-200 cursor-pointer
            {value?.id === choice.id ? 'bg-base-200 text-primary-content font-semibold' : ''}"
          onclick={() => selectChoice(choice)}
          role="option"
          aria-selected={value?.id === choice.id}
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
        >
          {choice.summary}
          {#if value?.id === choice.id}
            <Check size="16" />
          {/if}
        </button>
      {/each}
      {#if choiceList.length === 0}
        <div class="px-3 py-2 text-sm text-base-content/60">No options available.</div>
      {/if}
    </div>
  {/if}
</div>
