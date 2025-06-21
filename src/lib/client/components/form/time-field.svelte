<script lang="ts">
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

  interface TimeFieldProps {
    name: string;
    data: any;
    className?: string;
    isRightDiv?: boolean;
  }

  let { name, data, className, isRightDiv = false }: TimeFieldProps = $props();

  const timeSlotInterval = 15;

  let open = $state(false);

  let triggerButtonElement: HTMLInputElement | undefined = $state();
  let timeSlotsDropdown: HTMLDivElement | undefined = $state();
  let filterText = $state("");

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
    // Allow HH:mm format which is used for data storage
    if (/^\d{1,2}:\d{2}$/.test(timeString)) timeString += ":00";
    const parsed = parse(timeString, "HH:mm:ss", new Date());
    return isValid(parsed) ? parsed : new Date();
  }

  const currentDate = $derived.by(() => parseTime($data[name]));

  // FIX: Allow the input to be empty while focused (open).
  // When closed, it reverts to the formatted `currentDate`.
  const inputValue = $derived.by(() => (open ? filterText : formatDate(currentDate, "h:mm aa")));

  function selectTime(date: Date) {
    $data[name] = formatDate(date, "HH:mm");
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

    // Handle "9" -> 9:00 AM
    if (/^\d+$/.test(input)) {
      const num = parseInt(input, 10);
      if (num >= 0 && num < 24) {
        parsed = setHours(setMinutes(setSeconds(new Date(), 0), 0), num);
      }
    }

    // Handle "9pm", "14:30", "2:30 pm", etc.
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
      $data[name] = formatDate(parsed, "HH:mm");
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
          // Input is empty, revert to last value by closing.
          filterText = "";
          open = false;
        } else {
          // Input has a value, try to commit it.
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
    bind:this={triggerButtonElement}
    value={inputValue}
    onfocus={() => {
      open = true;
      filterText = $data[name] ? formatDate(parseTime($data[name]), "h:mm aa") : "";
    }}
    onblur={handleBlur}
    oninput={(e) => (filterText = (e.target as HTMLInputElement).value)}
    onkeydown={handleKeyDown}
    onclick={() => {
      open = true;
      triggerButtonElement?.select();
    }}
    class="w-full cursor-pointer rounded-md border border-base-300 bg-base-100 px-3 py-2 text-left text-sm outline-none hover:bg-base-200"
    autocomplete="off"
    placeholder="hh:mm aa"
  />

  {#if open}
    <div
      bind:this={timeSlotsDropdown}
      class={cn(
        "absolute z-50 mt-1 max-h-60 w-48 overflow-y-auto rounded-xl border border-base-300 bg-base-100 p-2 shadow-xl",
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
                ? "bg-base-300 font-semibold text-base-content"
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
</div>
