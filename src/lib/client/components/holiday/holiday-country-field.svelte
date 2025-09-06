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
  import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

  import { portal } from "$lib/client/actions/portal";
  import { cn } from "$lib/client/utils/cn";

  import type { HolidayCountry } from "$lib/shared/types";

  import { Icon } from "../icons";

  interface Props {
    name: string;
    holidayCountries: HolidayCountry[];
    class?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
    placement?: Placement;
  }

  let {
    name,
    holidayCountries,
    class: classCn,
    formData,
    formErrors,
    placement = "bottom-start"
  }: Props = $props();

  let triggerButton = $state<HTMLInputElement | null>(null);
  let dropdown = $state<HTMLDivElement | null>(null);
  let open = $state(false);
  let filterText = $state("");
  let cleanup: (() => void) | null = null;

  const error = $derived($formErrors[name]);

  const countries = holidayCountries
    .map((c) => ({ label: `${c.countryName} (${c.countryCode})`, value: c.id }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const filtered = $derived.by(() => {
    const q = filterText.toLowerCase();
    return countries.filter((c) => c.label.toLowerCase().includes(q));
  });

  $effect(() => {
    const current = $formData[name];
    const valid = holidayCountries.some((c) => c.id === current);
    if (!valid && holidayCountries.length > 0) $formData[name] = holidayCountries[0].id;
  });

  function selectCountry(id: string) {
    $formData[name] = id;
    open = false;
    filterText = "";
    triggerButton?.blur();
  }

  function getSelectedLabel() {
    const selected = holidayCountries.find((c) => c.id === $formData[name]);
    return selected ? `${selected.countryName} (${selected.countryCode})` : "";
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
        if (open) (dropdown?.querySelector('[role="option"]') as HTMLElement | null)?.focus();
        else open = true;
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
      if (!triggerButton?.contains(related) && !dropdown?.contains(related)) open = false;
    }, 100);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!triggerButton?.contains(target) && !dropdown?.contains(target)) {
      open = false;
      filterText = "";
    }
  }

  function updatePosition() {
    if (!triggerButton || !dropdown) return;
    computePosition(triggerButton, dropdown, {
      placement,
      middleware: [offset(6), flip(), shift({ padding: 8 })]
    }).then(({ x, y }) => {
      Object.assign(dropdown!.style, { left: `${x}px`, top: `${y}px` });
    });
  }

  $effect(() => {
    if (open && triggerButton && dropdown) {
      cleanup = autoUpdate(triggerButton, dropdown, updatePosition, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        animationFrame: false
      });
      updatePosition();
    } else cleanup?.();
  });
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
      "input hover:bg-base-200 w-full cursor-pointer border px-3 py-2 text-left text-sm outline-none focus:outline-none",
      error ? "border-error bg-error/5 text-error" : "border-base-300 bg-base-100"
    )}
    autocomplete="off"
    placeholder="e.g., United States (US)"
  />

  <Icon
    icon={ArrowDown01Icon}
    class="pointer-events-none absolute top-2.5 right-3 h-4 w-4 opacity-40"
    absoluteStrokeWidth
  />

  {#if open}
    <div
      bind:this={dropdown}
      use:portal
      class="border-base-300 bg-base-100 border-rounded z-[9999] max-h-64 w-[260px] overflow-auto border shadow-xl"
      role="listbox"
      tabindex="-1"
      style="position: absolute; top: 0; left: 0;"
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
