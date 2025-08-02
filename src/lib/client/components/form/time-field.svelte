<script lang="ts">
  import type { Writable } from "svelte/store";

  import {
    addMinutes,
    format as formatDate,
    isSameHour,
    isSameMinute,
    isValid,
    parse,
    setHours,
    setMinutes,
    setSeconds,
    startOfDay
  } from "date-fns";

  import { cn } from "$lib/client/utils/cn";

  interface Props {
    name: string;
    className?: string;
    isRightDiv?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
  }

  let { name, className, isRightDiv = false, formData, formErrors }: Props = $props();

  const timeSlotInterval = 15;

  let open = $state(false);
  let triggerButtonElement: HTMLInputElement | undefined = $state();
  let timeSlotsDropdown: HTMLDivElement | undefined = $state();
  let filterText = $state("");

  const error = $derived($formErrors[name]);

  const allTimeSlots = $derived.by(() => {
    const slots: Date[] = [];
    let time = startOfDay(new Date());
    for (let i = 0; i < 24 * (60 / timeSlotInterval); i++) {
      slots.push(time);
      time = addMinutes(time, timeSlotInterval);
    }
    return slots;
  });

  const filteredTimeSlots = $derived.by(() => {
    if (!filterText) return allTimeSlots;
    const lower = filterText.toLowerCase();
    return allTimeSlots.filter((slot) => formatDate(slot, "h:mm aa").toLowerCase().includes(lower));
  });

  function parseTime(timeString: string): Date {
    if (!timeString) return new Date();
    if (/^\d{1,2}:\d{2}$/.test(timeString)) timeString += ":00";
    const parsed = parse(timeString, "HH:mm:ss", new Date());
    return isValid(parsed) ? parsed : new Date();
  }

  const currentDate = $derived.by(() => parseTime($formData[name]));

  const inputValue = $derived.by(() => (open ? filterText : formatDate(currentDate, "h:mm aa")));

  function selectTime(date: Date) {
    $formData[name] = formatDate(date, "HH:mm:ss");
    filterText = "";
    open = false;
    triggerButtonElement?.blur();
  }

  function commitInput() {
    const input = (filterText || "").trim().toLowerCase();
    if (!input) {
      filterText = "";
      open = false;
      return;
    }

    let parsed: Date | null = null;

    if (/^\d+$/.test(input)) {
      const num = parseInt(input, 10);
      if (num >= 0 && num < 24) {
        parsed = setHours(setMinutes(setSeconds(new Date(), 0), 0), num);
      }
    }

    if (!parsed && input) {
      const formats = ["h:mm aa", "HH:mm", "h a", "ha"];
      for (const fmt of formats) {
        const p = parse(input, fmt, new Date());
        if (isValid(p)) {
          parsed = p;
          break;
        }
      }
    }

    if (parsed) {
      $formData[name] = formatDate(parsed, "HH:mm:ss");
    }

    filterText = "";
    open = false;
    triggerButtonElement?.blur();
  }

  function handleBlur(event: FocusEvent) {
    setTimeout(() => {
      const related = event.relatedTarget as Node;
      const isOutside =
        !triggerButtonElement?.contains(related) && !timeSlotsDropdown?.contains(related);

      if (isOutside) {
        if (!filterText.trim()) {
          filterText = "";
          open = false;
        } else {
          commitInput();
        }
      }
    }, 100);
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        commitInput();
        break;
      case "Escape":
        event.preventDefault();
        open = false;
        filterText = "";
        break;
      case "ArrowDown":
        event.preventDefault();
        if (open) {
          (timeSlotsDropdown?.querySelector('[role="option"]') as HTMLElement | null)?.focus();
        } else {
          open = true;
        }
        break;
      case "Tab":
        if (open) commitInput();
        break;
    }
  }

  function handleSlotKeyDown(event: KeyboardEvent, slot: Date) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectTime(slot);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextSibling = (event.target as HTMLElement).nextElementSibling as HTMLElement | null;
      nextSibling?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousSibling = (event.target as HTMLElement)
        .previousElementSibling as HTMLElement | null;
      previousSibling?.focus();
    } else if (event.key === "Escape" || event.key === "Tab") {
      event.preventDefault();
      triggerButtonElement?.focus();
      open = false;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!triggerButtonElement?.contains(target) && !timeSlotsDropdown?.contains(target)) {
      if (!filterText.trim()) {
        filterText = "";
        open = false;
      } else {
        commitInput();
      }
    }
  }
</script>

<svelte:window onmousedown={handleClickOutside} />

<div class={cn("relative w-full", className)}>
  <input
    type="text"
    aria-label="Time input"
    aria-invalid={error ? "true" : "false"}
    bind:this={triggerButtonElement}
    value={inputValue}
    onfocus={() => {
      open = true;
      filterText = $formData[name] ? formatDate(parseTime($formData[name]), "h:mm aa") : "";
    }}
    onblur={handleBlur}
    oninput={(e) => (filterText = (e.target as HTMLInputElement).value)}
    onkeydown={handleKeyDown}
    onclick={() => {
      open = true;
      triggerButtonElement?.select();
    }}
    class={cn(
      "bg-base-100 hover:bg-base-200 w-full cursor-pointer rounded-md border px-3 py-2 text-left text-sm outline-none",
      error ? "border-error text-error" : "border-base-300"
    )}
    autocomplete="off"
    placeholder="hh:mm aa"
  />

  {#if open && filteredTimeSlots.length > 0}
    <div
      bind:this={timeSlotsDropdown}
      class={cn(
        "bg-base-100 absolute z-50 mt-1 max-h-60 w-48 overflow-y-auto rounded-xl border p-2 shadow-xl",
        error ? "border-error" : "border-base-300",
        isRightDiv ? "right-0" : "left-0"
      )}
      role="listbox"
    >
      <div class="space-y-0.5">
        {#each filteredTimeSlots as slot (formatDate(slot, "HH:mm"))}
          {@const isSelected = isSameHour(slot, currentDate) && isSameMinute(slot, currentDate)}
          <button
            type="button"
            role="option"
            aria-selected={isSelected}
            data-selected={isSelected}
            class={cn(
              "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors focus:outline-none",
              isSelected
                ? "bg-base-300 text-base-content font-semibold"
                : "hover:bg-base-200/60 focus:bg-base-200/60"
            )}
            onclick={() => selectTime(slot)}
            onkeydown={(e) => handleSlotKeyDown(e, slot)}
            tabindex="-1"
          >
            {formatDate(slot, "h:mm aa")}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  {#if error}
    <p class="text-error mt-1 text-sm">{error || "This field is required"}</p>
  {/if}
</div>
