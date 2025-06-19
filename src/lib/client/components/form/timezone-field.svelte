<script lang="ts">
  import { ChevronDown } from "@lucide/svelte";
  import { getTimeZones } from "@vvo/tzdb";

  import { cn } from "$lib/client/utils/cn";

  interface TimezoneFieldProps {
    name: string;
    data: any;
    className?: string;
  }

  let { name, data, className }: TimezoneFieldProps = $props();

  let triggerButton = $state<HTMLInputElement | undefined>();
  let dropdown = $state<HTMLDivElement | undefined>();
  let open = $state(false);
  let filterText = $state("");

  const timezones = getTimeZones()
    .map((tz) => tz.name)
    .sort((a, b) => a.localeCompare(b));

  let filtered = $derived.by(() => {
    const q = filterText.toLowerCase();
    return timezones.filter((tz) => tz.toLowerCase().includes(q));
  });

  function selectTimezone(tz: string) {
    $data[name] = tz;
    open = false;
    filterText = "";
    triggerButton?.blur();
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        if (filtered.length > 0) selectTimezone(filtered[0]);
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

        if (!filterText.trim()) {
          filterText = "";
        }
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
</script>

<svelte:window onmousedown={handleClickOutside} />

<div class={cn("relative w-full", className)}>
  <input
    type="text"
    aria-label="Timezone input"
    bind:this={triggerButton}
    value={open ? filterText : $data[name]}
    onfocus={() => {
      open = true;
      filterText = $data[name];
    }}
    onblur={handleBlur}
    oninput={(e) => (filterText = (e.target as HTMLInputElement).value)}
    onkeydown={handleKeyDown}
    onclick={() => {
      open = true;
      triggerButton?.select();
    }}
    class="w-full cursor-pointer rounded-md border border-base-300 bg-base-100 px-3 py-2 text-left text-sm outline-none hover:bg-base-200"
    autocomplete="off"
    placeholder="e.g., Asia/Tokyo"
  />

  <ChevronDown class="absolute right-3 top-2.5 pointer-events-none h-4 w-4 opacity-40" />

  {#if open}
    <div
      bind:this={dropdown}
      class="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-base-300 bg-base-100 shadow-xl"
    >
      {#each filtered.slice(0, 100) as tz}
        <button
          type="button"
          class="w-full px-3 py-2 text-left text-sm hover:bg-base-200 focus:bg-base-200 outline-none"
          onclick={() => selectTimezone(tz)}
          tabindex="-1"
        >
          {tz}
        </button>
      {/each}
      {#if filtered.length === 0}
        <div class="px-3 py-2 text-sm text-base-content/50">No results</div>
      {/if}
    </div>
  {/if}
</div>
