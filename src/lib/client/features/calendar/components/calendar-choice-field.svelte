<script lang="ts">
  import type { Writable } from "svelte/store";

  import { Check, ChevronDown } from "@lucide/svelte";

  import { cn } from "$lib/client/utils/cn";

  import type { Calendar } from "$lib/shared/types";

  interface Props {
    name: string;
    calendars: Calendar[];
    placeholder?: string;
    className?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
  }

  let { name, calendars, className, formData, formErrors }: Props = $props();

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement>();
  let triggerButtonRef = $state<HTMLButtonElement>();

  let selectedCalendar = $derived.by(() => calendars.find((c) => c.id === $formData[name]));

  let error = $derived($formErrors[name]);

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

<div class={cn("relative w-full", className)}>
  <button
    type="button"
    bind:this={triggerButtonRef}
    class={cn(
      "w-full px-3 py-2 border rounded-md text-sm bg-base-100 hover:bg-base-200 text-left flex justify-between items-center outline-none",
      error ? "border-error text-error" : "border-base-300"
    )}
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
    <span>{$formData[name] ? selectedCalendar?.name : "Select a calendar"}</span>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if error}
    <p class="mt-1 text-xs text-error">{error || "This field is required"}</p>
  {/if}

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
            class={cn(
              "flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md transition-colors focus:outline-none",
              $formData[name] === choice.id
                ? "bg-base-200 text-primary-content font-semibold"
                : "hover:bg-base-300/60 focus:bg-base-300/60"
            )}
            onclick={() => selectChoice(choice)}
            role="option"
            aria-selected={$formData[name] === choice.id}
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
            disabled={$formData[name] === choice.id}
          >
            {choice.name}
            {#if $formData[name] === choice.id}
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
