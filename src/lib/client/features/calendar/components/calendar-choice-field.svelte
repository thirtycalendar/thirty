<script lang="ts">
  import { Check, ChevronDown } from "@lucide/svelte";

  import { cn } from "$lib/client/utils/cn";

  import type { Calendar } from "$lib/types";

  interface CalendarChoiceFieldProps {
    name: string;
    calendarId: string;
    calendars: Calendar[];
    placeholder?: string;
    className?: string;
  }

  let { calendarId, calendars, className }: CalendarChoiceFieldProps = $props();

  let selectedCalendar: Calendar | undefined = $derived(calendars.find((c) => c.id === calendarId));

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement | undefined>(undefined);
  let triggerButtonRef = $state<HTMLButtonElement | undefined>(undefined);

  function selectChoice(choice: Calendar) {
    if (calendarId === choice.id) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }

    calendarId = choice.id;

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
    class="w-full px-3 py-2 border rounded-md text-sm bg-base-100 hover:bg-base-200 text-left flex justify-between items-center border-base-300 outline-none"
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
    <span>{selectedCalendar?.name}</span>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      class="absolute mt-1 z-50 w-full rounded-xl border border-base-300 bg-base-100 shadow-xl max-h-60 overflow-y-auto p-3"
      role="listbox"
      tabindex="-1"
    >
      <div class="space-y-0.5">
        {#each calendars as choice (choice.id)}
          <button
            type="button"
            class="flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md transition-colors
              {calendarId === choice.id ? 'bg-base-200 text-primary-content font-semibold' : ''}
              hover:bg-base-300/60 focus:bg-base-300/60 focus:outline-none"
            onclick={() => selectChoice(choice)}
            role="option"
            aria-selected={calendarId === choice.id}
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
            disabled={calendarId === choice.id}
          >
            {choice.name}
            {#if calendarId === choice.id}
              <Check size="16" />
            {/if}
          </button>
        {/each}
        {#if calendars.length === 0}
          <div class="px-3 py-2 text-sm text-base-content/60">No calendars available.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
