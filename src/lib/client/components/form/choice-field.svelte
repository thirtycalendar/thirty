<script lang="ts">
  import type { Writable } from "svelte/store";

  import { cn } from "$lib/client/utils/cn";

  import { capitalizeFirstLetter } from "$lib/shared/utils/string";

  import { Check, ChevronDown } from "../icons";

  interface Props {
    name: string;
    choiceList: readonly string[];
    class?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
    handleInput: (event: Event) => void;
  }

  let { name, choiceList, class: classCn, formData, formErrors, handleInput }: Props = $props();

  let open = $state(false);
  let dropdownRef = $state<HTMLDivElement>();
  let triggerButtonRef = $state<HTMLButtonElement>();

  let selectedValue = $derived.by(() => $formData[name] ?? choiceList[0]);
  let error = $derived($formErrors[name]);

  function selectChoice(choice: string) {
    if ($formData[name] === choice) {
      open = false;
      setTimeout(() => triggerButtonRef?.focus(), 0);
      return;
    }

    $formData[name] = choice;

    if (handleInput) {
      const event = new Event("input", { bubbles: true, cancelable: true });
      Object.defineProperty(event, "target", {
        writable: false,
        value: { name, value: choice }
      });
      handleInput(event);
    }

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
      "bg-base-100 hover:bg-base-200 flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm outline-none",
      error ? "border-error" : "border-base-300"
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
    <span>{capitalizeFirstLetter(selectedValue)}</span>
    <ChevronDown size="16" class={cn("transition-transform", open && "rotate-180")} />
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      class="border-base-300 bg-base-100 absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border p-3 shadow-xl"
      role="listbox"
      tabindex="-1"
    >
      <div class="space-y-0.5">
        {#each choiceList as choice (choice)}
          <button
            type="button"
            class={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors",
              $formData[name] === choice ? "bg-base-200 text-primary-content font-semibold" : "",
              "hover:bg-base-300/60 focus:bg-base-300/60 focus:outline-none"
            )}
            onclick={() => selectChoice(choice)}
            role="option"
            aria-selected={$formData[name] === choice}
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
            disabled={$formData[name] === choice}
          >
            {capitalizeFirstLetter(choice)}
            {#if $formData[name] === choice}
              <Check size="16" />
            {/if}
          </button>
        {/each}

        {#if choiceList.length === 0}
          <div class="text-base-content/60 px-3 py-2 text-sm">No options available.</div>
        {/if}
      </div>
    </div>
  {/if}

  {#if error}
    <p class="text-error mt-1 text-sm">{error}</p>
  {/if}
</div>
