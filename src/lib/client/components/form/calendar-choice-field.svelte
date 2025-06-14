<script lang="ts">
  import { Check, ChevronDown } from "@lucide/svelte";

  import { session } from "$lib/client/stores/user-session";
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

  let value: string | undefined = $derived($formData[name]);
  let selectedCalendar: Calendar | undefined = $derived(choiceList.find((c) => c.id === value));
  let error = $derived($formErrors[name]);

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | undefined>(undefined);
  let triggerButtonRef = $state<HTMLButtonElement | undefined>(undefined);

  const filteredChoiceList = $derived(
    choiceList
      .filter((calendar) => calendar.accessRole === "owner")
      .map((c) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.summary);
        return {
          ...c,
          summary: isEmail ? ($session?.name ?? c.summary) : c.summary
        };
      })
  );

  function selectChoice(choice: Calendar) {
    let newValue: string | undefined;

    if (value === choice.id) {
      newValue = undefined; // Deselect
    } else {
      newValue = choice.id; // Select the ID
    }

    $formData[name] = newValue; // Update the store directly

    const mockEvent = new Event("input", { bubbles: true });
    const mockTarget = {
      name: name,
      value: newValue,
      type: "text"
    };
    Object.defineProperty(mockEvent, "target", { writable: false, value: mockTarget });

    handleInput(mockEvent);

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
    <span>{selectedCalendar ? selectedCalendar.summary : placeholder || "Select a calendar"}</span>
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
          >
            {choice.summary}
            {#if value === choice.id}
              <Check size="16" />
            {/if}
          </button>
        {/each}
        {#if filteredChoiceList.length === 0}
          <div class="px-3 py-2 text-sm text-base-content/60">No owner calendars available.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
