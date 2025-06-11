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

  interface TimeFieldProps {
    name: string;
    formData: any;
    formErrors: any;
    handleInput: (event: Event) => void;
  }

  let { name, formData, formErrors, handleInput }: TimeFieldProps = $props();

  let value: Date = $derived(
    isValidDate(new Date($formData[name])) ? new Date($formData[name]) : new Date()
  );

  let error = $derived($formData[name]);

  let open = $state(false);
  let currentInputText = $state("");
  let filterText = $state("");
  let justSelected = $state(false);

  $effect(() => {
    if (!open || (open && !filterText)) {
      currentInputText = formatDateFns(value, "h:mm aa");
    }
  });

  let triggerButtonElement: HTMLInputElement | undefined = $state();
  let timeSlotsDropdown: HTMLDivElement | undefined = $state();

  const timeSlotInterval = 15;

  function generateTimeSlots(): Date[] {
    const slots: Date[] = [];
    let slotTime = startOfDay(value);
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

  $effect(() => {
    if (open && filterText) {
      tryAutoDetectTime();
    }
  });

  $effect(() => {
    if (open && timeSlotsDropdown) {
      setTimeout(() => {
        if (!timeSlotsDropdown) return;
        const selectedItem = timeSlotsDropdown.querySelector<HTMLElement>(`[data-selected="true"]`);
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
          const currentHour = value.getHours();
          const currentMinute = value.getMinutes();
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
          if (bestMatchIndex === -1 && slots.length > 0) {
            bestMatchIndex = slots.length - 1;
          }
          if (bestMatchIndex !== -1 && timeSlotsDropdown.children.length > bestMatchIndex) {
            const itemToScroll = timeSlotsDropdown.children[bestMatchIndex] as HTMLElement;
            itemToScroll?.scrollIntoView({
              block: "nearest",
              behavior: "smooth"
            });
          }
        }
      }, 10);
    }
  });

  function selectTime(slotDate: Date): void {
    let newDate = setHours(value, slotDate.getHours());
    newDate = setMinutes(newDate, slotDate.getMinutes());
    newDate = setSeconds(newDate, 0);
    value = newDate;
    filterText = "";
    open = false;
    justSelected = true;
    setTimeout(() => {
      triggerButtonElement?.blur();
    }, 0);
  }

  function tryAutoDetectTime(): boolean {
    const formatsToTry = ["h:mm aa", "HH:mm", "h:m aa", "H:m", "ha", "Ha", "h a", "H"];
    for (const fmt of formatsToTry) {
      try {
        const parsed = parseDateFns(filterText, fmt, value);
        if (isValidDate(parsed)) {
          currentInputText = filterText;
          return true;
        }
      } catch (e) {}
    }
    return false;
  }

  function parseAndSetTime(): void {
    const formatsToTry = ["h:mm aa", "HH:mm", "h:m aa", "H:m", "ha", "Ha", "h a", "H"];
    let parsedDateSuccessfully = false;
    for (const fmt of formatsToTry) {
      try {
        const parsed = parseDateFns(filterText || currentInputText, fmt, value);
        if (isValidDate(parsed)) {
          let newDate = setHours(value, parsed.getHours());
          newDate = setMinutes(newDate, parsed.getMinutes());
          newDate = setSeconds(newDate, 0);
          value = newDate;
          parsedDateSuccessfully = true;
          break;
        }
      } catch (e) {}
    }
    if (!parsedDateSuccessfully) {
      currentInputText = formatDateFns(value, "h:mm aa");
    }
    filterText = "";
  }

  function handleInputFocus(): void {
    if (justSelected) {
      justSelected = false;
      return;
    }
    open = true;
    setTimeout(() => {
      const selectedItem = timeSlotsDropdown?.querySelector<HTMLElement>('[data-selected="true"]');
      selectedItem?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 10);
  }

  function handleInputBlur(): void {
    setTimeout(() => {
      const activeEl = document.activeElement;
      if (triggerButtonElement && timeSlotsDropdown) {
        if (activeEl !== triggerButtonElement && !timeSlotsDropdown.contains(activeEl)) {
          if (open) {
            parseAndSetTime();
            open = false;
          }
        }
      } else if (open) {
        parseAndSetTime();
        open = false;
      }
    }, 150);
  }

  function handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    filterText = input.value;
    currentInputText = input.value;
    if (!input.value) {
      filterText = "";
    }
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
      currentInputText = formatDateFns(value, "h:mm aa");
      open = false;
      triggerButtonElement?.blur();
    } else if (event.key === "ArrowDown") {
      if (open && timeSlotsDropdown?.firstChild) {
        event.preventDefault();
        (timeSlotsDropdown.firstChild as HTMLElement)?.focus();
      } else if (!open) {
        open = true;
      }
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
    return isSameHour(slot, value) && isSameMinute(slot, value);
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

<div class="relative w-full">
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
    class="w-full px-3 py-2 border border-base-300 rounded-md text-sm bg-base-100 hover:bg-base-200 text-left cursor-pointer focus:ring-1 focus:ring-primary focus:border-primary outline-none"
    autocomplete="off"
    placeholder="hh:mm"
  />

  {#if open}
    <div
      bind:this={timeSlotsDropdown}
      class={`${filteredTimeSlots.length === 0 && "hidden"} absolute mt-1 z-50 w-64 max-h-60 overflow-y-auto p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl`}
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
