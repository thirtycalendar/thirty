<script lang="ts">
  import {
    addMinutes as addMinutesFns,
    format as formatDateFns,
    isSameHour,
    isSameMinute,
    isValid as isValidDate,
    parse as parseDateFns,
    setHours,
    setMinutes,
    setSeconds,
    startOfDay
  } from "date-fns";

  import { cn } from "$lib/client/utils/cn";

  interface TimeFieldProps {
    name: string;
    className?: string;
    isRightDiv?: boolean;
    formData: any; // Expects formData[name] to be "HH:mm:ss.SSS" string
    formErrors: any;
    handleInput: (event: Event) => void;
  }

  let { name, className, isRightDiv, formData, formErrors, handleInput }: TimeFieldProps = $props();

  function getTimeAsDate(timeString: string | undefined | null): Date {
    if (!timeString) return new Date(); // Default to now if no value
    const parsed = parseDateFns(timeString, "HH:mm:ss.SSS", new Date());
    return isValidDate(parsed) ? parsed : new Date();
  }

  let internalDate: Date = $derived(getTimeAsDate($formData[name]));

  let open = $state(false);
  let currentInputText = $state("");
  let filterText = $state("");
  let justSelected = $state(false);

  $effect(() => {
    if (!open || (open && !filterText)) {
      currentInputText = formatDateFns(internalDate, "h:mm aa");
    }
  });

  let triggerButtonElement: HTMLInputElement | undefined = $state();
  let timeSlotsDropdown: HTMLDivElement | undefined = $state();

  const timeSlotInterval = 15;

  function generateTimeSlots(): Date[] {
    const slots: Date[] = [];
    let slotTime = startOfDay(internalDate);
    for (let i = 0; i < (24 * 60) / timeSlotInterval; i++) {
      slots.push(new Date(slotTime));
      slotTime = addMinutesFns(slotTime, timeSlotInterval);
    }
    return slots;
  }

  const allTimeSlots: Date[] = $derived(generateTimeSlots());

  const filteredTimeSlots: Date[] = $derived(
    (() => {
      if (!filterText) return allTimeSlots;
      const lowercaseFilter = filterText.toLowerCase();
      return allTimeSlots.filter((slot) => {
        const timeString = formatDateFns(slot, "h:mm aa").toLowerCase();
        return timeString.includes(lowercaseFilter);
      });
    })()
  );

  // Propagate changes to the parent form using the provided callback.
  function updateFormValue(newDate: Date): void {
    const newTimeString = formatDateFns(newDate, "HH:mm:ss.SSS");
    // Create a mock event to pass to the form handler.
    const event = new Event("input", { bubbles: true });
    const mockTarget = { name, value: newTimeString };
    Object.defineProperty(event, "target", { writable: false, value: mockTarget });
    handleInput(event);
  }

  function selectTime(slotDate: Date): void {
    let newDate = setHours(internalDate, slotDate.getHours());
    newDate = setMinutes(newDate, slotDate.getMinutes());
    newDate = setSeconds(newDate, 0); // Selecting from a slot resets seconds.

    updateFormValue(newDate);

    filterText = "";
    open = false;
    justSelected = true;
    setTimeout(() => {
      triggerButtonElement?.blur();
    }, 0);
  }

  function parseAndSetTime(): void {
    const formatsToTry = ["h:mm aa", "HH:mm", "h:m aa", "H:m", "ha", "Ha", "h a", "H"];
    const textToParse = filterText || currentInputText;

    for (const fmt of formatsToTry) {
      const parsed = parseDateFns(textToParse, fmt, internalDate);
      if (isValidDate(parsed)) {
        let newDate = setHours(internalDate, parsed.getHours());
        newDate = setMinutes(newDate, parsed.getMinutes());
        newDate = setSeconds(newDate, 0); // Reset seconds on free-form input.

        updateFormValue(newDate);
        filterText = "";
        return; // Exit after successful parse
      }
    }
    // If parsing fails, do nothing. The input text will revert automatically via the $effect.
    filterText = "";
  }

  $effect(() => {
    if (open && timeSlotsDropdown) {
      setTimeout(() => {
        if (!timeSlotsDropdown) return;
        const selectedItem = timeSlotsDropdown.querySelector<HTMLElement>(`[data-selected="true"]`);
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest" });
        } else {
          const currentHour = internalDate.getHours();
          const currentMinute = internalDate.getMinutes();
          let bestMatchIndex = -1;
          const slots: Date[] = filteredTimeSlots.length > 0 ? filteredTimeSlots : allTimeSlots;
          for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (
              slot.getHours() > currentHour ||
              (slot.getHours() === currentHour && slot.getMinutes() >= currentMinute)
            ) {
              bestMatchIndex = i;
              break;
            }
          }
          if (bestMatchIndex === -1 && slots.length > 0) bestMatchIndex = 0;
          if (bestMatchIndex !== -1) {
            (timeSlotsDropdown.children[bestMatchIndex] as HTMLElement)?.scrollIntoView({
              block: "nearest"
            });
          }
        }
      }, 10);
    }
  });

  function handleInputFocus(): void {
    if (justSelected) {
      justSelected = false;
      return;
    }
    open = true;
  }

  function handleInputBlur(): void {
    setTimeout(() => {
      const activeEl = document.activeElement;
      if (
        open &&
        triggerButtonElement &&
        activeEl !== triggerButtonElement &&
        !timeSlotsDropdown?.contains(activeEl)
      ) {
        parseAndSetTime();
        open = false;
      }
    }, 150);
  }

  function handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    filterText = input.value;
    currentInputText = input.value;
  }

  function handleInputKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      parseAndSetTime();
      open = false;
      triggerButtonElement?.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      filterText = "";
      open = false;
      triggerButtonElement?.blur();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      open = true;
      setTimeout(() => (timeSlotsDropdown?.firstChild as HTMLElement)?.focus(), 0);
    } else if (event.key === "Tab" && open) {
      parseAndSetTime();
      open = false;
    }
  }

  function handleTimeSlotKeyDown(event: KeyboardEvent, slot: Date): void {
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
      open = false;
      triggerButtonElement?.focus();
    }
  }

  function isSelectedTime(slot: Date): boolean {
    return isSameHour(slot, internalDate) && isSameMinute(slot, internalDate);
  }

  function handleClickOutside(event: MouseEvent): void {
    if (open && timeSlotsDropdown && triggerButtonElement) {
      const target = event.target as Node;
      if (!timeSlotsDropdown.contains(target) && !triggerButtonElement.contains(target)) {
        parseAndSetTime();
        open = false;
      }
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class={cn("relative w-full", className)}>
  <input
    type="text"
    aria-label="Time input"
    bind:this={triggerButtonElement}
    bind:value={currentInputText}
    onfocus={handleInputFocus}
    onblur={handleInputBlur}
    onkeydown={handleInputKeydown}
    oninput={handleInputChange}
    onclick={() => {
      open = true;
      setTimeout(() => triggerButtonElement?.select(), 0);
    }}
    class="w-full px-3 py-2 border border-base-300 rounded-md text-sm bg-base-100 hover:bg-base-200 text-left cursor-pointer outline-none"
    autocomplete="off"
    placeholder="hh:mm"
  />

  {#if open}
    <div
      bind:this={timeSlotsDropdown}
      class={`${filteredTimeSlots.length === 0 && "hidden"} absolute ${isRightDiv ? "right-0" : "left-0"} mt-1 z-50 w-50 max-h-60 overflow-y-auto p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl`}
      role="listbox"
      aria-labelledby={triggerButtonElement?.id || undefined}
    >
      <div class="space-y-0.5">
        {#each filteredTimeSlots as slot (formatDateFns(slot, "HH:mm"))}
          {@const timeSlot = slot as Date}
          <button
            type="button"
            role="option"
            aria-selected={isSelectedTime(timeSlot)}
            data-selected={isSelectedTime(timeSlot)}
            class={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors
                ${isSelectedTime(timeSlot) ? "bg-base-200 text-primary-content font-semibold" : ""}
                hover:bg-base-300/60 focus:bg-base-300/60 focus:outline-none`}
            onclick={() => selectTime(timeSlot)}
            onkeydown={(e) => handleTimeSlotKeyDown(e, timeSlot)}
            tabindex="-1"
          >
            {formatDateFns(timeSlot, "h:mm aa")}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
