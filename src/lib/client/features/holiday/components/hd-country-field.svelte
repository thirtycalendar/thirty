<script lang="ts">
  import type { Writable } from "svelte/store";

  import { ChevronDown } from "@lucide/svelte";

  import { cn } from "$lib/client/utils/cn";

  import type { HolidayCountry } from "$lib/shared/types";

  interface Props {
    name: string;
    holidayCountries: HolidayCountry[];
    class?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
  }

  let { name, holidayCountries, class: classCn, formData, formErrors }: Props = $props();

  let triggerButton = $state<HTMLInputElement | undefined>();
  let dropdown = $state<HTMLDivElement | undefined>();
  let open = $state(false);
  let filterText = $state("");

  const error = $derived($formErrors[name]);

  const countries = holidayCountries
    .map((c) => ({
      label: `${c.countryName} (${c.countryCode})`,
      value: c.id
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const filtered = $derived.by(() => {
    const q = filterText.toLowerCase();
    return countries.filter((c) => c.label.toLowerCase().includes(q));
  });

  $effect(() => {
    const current = $formData[name];
    const valid = holidayCountries.some((c) => c.id === current);
    if (!valid && holidayCountries.length > 0) {
      $formData[name] = holidayCountries[0].id;
    }
  });

  function selectCountry(id: string) {
    $formData[name] = id;
    open = false;
    filterText = "";
    triggerButton?.blur();
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        if (filtered.length > 0) selectCountry(filtered[0].value);
        break;
      case "Escape":
        open = false;
        filterText = "";
        break;
      case "ArrowDown":
        event.preventDefault();
        if (open) {
          const first = dropdown?.querySelector('[role="option"]');
          if (first instanceof HTMLElement) first.focus();
        } else {
          open = true;
        }
        break;
      case "Tab":
        if (open) {
          open = false;
          filterText = "";
        }
        break;
    }
  }

  function handleBlur(event: FocusEvent) {
    setTimeout(() => {
      const related = event.relatedTarget as Node;
      const isOutside = !triggerButton?.contains(related) && !dropdown?.contains(related);
      if (isOutside) {
        open = false;
        if (!filterText.trim()) filterText = "";
      }
    }, 100);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!triggerButton?.contains(target) && !dropdown?.contains(target)) {
      open = false;
      filterText = "";
    }
  }

  function getSelectedLabel() {
    const selected = holidayCountries.find((c) => c.id === $formData[name]);
    return selected ? `${selected.countryName} (${selected.countryCode})` : "";
  }
</script>

<svelte:window onmousedown={handleClickOutside} />

<div class={cn("relative w-full", classCn)}>
  <input
    type="text"
    aria-label="Country input"
    bind:this={triggerButton}
    value={open ? filterText : getSelectedLabel()}
    onfocus={() => {
      open = true;
      filterText = getSelectedLabel();
    }}
    onblur={handleBlur}
    oninput={(e) => (filterText = (e.target as HTMLInputElement).value)}
    onkeydown={handleKeyDown}
    onclick={() => {
      open = true;
      triggerButton?.select();
    }}
    class={cn(
      "w-full cursor-pointer rounded-md border px-3 py-2 text-left text-sm outline-none",
      "hover:bg-base-200",
      error ? "border-error bg-error/5 text-error" : "border-base-300 bg-base-100"
    )}
    autocomplete="off"
    placeholder="e.g., United States (US)"
  />

  <ChevronDown class="pointer-events-none absolute top-2.5 right-3 h-4 w-4 opacity-40" />

  {#if open}
    <div
      bind:this={dropdown}
      class="border-base-300 bg-base-100 absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-xl border shadow-xl"
    >
      {#each filtered.slice(0, 100) as country (country.value)}
        <button
          type="button"
          class="hover:bg-base-200 focus:bg-base-200 w-full px-3 py-2 text-left text-sm outline-none"
          onclick={() => selectCountry(country.value)}
          tabindex="-1"
        >
          {country.label}
        </button>
      {/each}
      {#if filtered.length === 0}
        <div class="text-base-content/50 px-3 py-2 text-sm">No results</div>
      {/if}
    </div>
  {/if}

  {#if error}
    <p class="text-error mt-1 text-sm">{error || "This field is required"}</p>
  {/if}
</div>
