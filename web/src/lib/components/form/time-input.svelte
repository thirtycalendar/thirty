<script lang="ts">
  import {
    format as formatDateFns,
    setHours,
    setMinutes,
    setSeconds,
    addMinutes as addMinutesFns,
    startOfDay,
    isSameHour,
    isSameMinute,
    parse as parseDateFns,
    isValid as isValidDate,
  } from "date-fns";

  // --- State ---
  let value = $state(new Date()); // The source of truth Date object (datetime)
  let open = $state(false);
  let currentInputText = $state(""); // Initialize with empty string
  let filterText = $state(""); // Text used for filtering time slots
  
  // Initialize currentInputText
  $effect(() => {
    if (!open || (open && !filterText)) {
      currentInputText = formatDateFns(value, "h:mm aa");
    }
  });

  // DOM element references
  let triggerButtonElement: HTMLInputElement | undefined = $state();
  let timeSlotsDropdown: HTMLDivElement | undefined = $state();

  const timeSlotInterval = 30; // Interval for time slots in minutes
  
  // --- Functions ---
  function generateTimeSlots(): Date[] {
    const slots: Date[] = [];
    // Generate slots based on the date part of the current `value`
    let slotTime = startOfDay(value);
    for (let i = 0; i < (24 * 60) / timeSlotInterval; i++) {
      slots.push(new Date(slotTime)); // Create new Date objects for slots
      slotTime = addMinutesFns(slotTime, timeSlotInterval);
    }
    return slots;
  }
  
  // --- Derived State ---
  // Generate all time slots
  const allTimeSlots: Date[] = $derived(generateTimeSlots());
  
  // Filter time slots based on user input
  const filteredTimeSlots: Date[] = $derived((() => {
    if (!filterText) return allTimeSlots;
    
    const lowercaseFilter = filterText.toLowerCase();
    return allTimeSlots.filter(slot => {
      const timeString = formatDateFns(slot, "h:mm aa").toLowerCase();
      return timeString.includes(lowercaseFilter);
    });
  })());

  // --- Effects ---
  // Effect to try auto-detecting time format as user types
  $effect(() => {
    if (open && filterText) {
      tryAutoDetectTime();
    }
  });

  // Effect to scroll the dropdown when it opens
  $effect(() => {
    if (open && timeSlotsDropdown) {
      // Delay to ensure DOM is updated
      setTimeout(() => {
        if (!timeSlotsDropdown) return;
        
        const selectedItem = timeSlotsDropdown.querySelector<HTMLElement>(
          `[data-selected="true"]`
        );
        
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
          // Scroll to a time slot at or just after the current `value`'s time
          const currentHour = value.getHours();
          const currentMinute = value.getMinutes();
          let bestMatchIndex = -1;
          
          const slots: Date[] = filteredTimeSlots.length > 0 ? filteredTimeSlots : allTimeSlots;
          for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (
              slot.getHours() > currentHour ||
              (slot.getHours() === currentHour &&
                slot.getMinutes() >= currentMinute)
            ) {
              bestMatchIndex = i;
              break;
            }
          }
          
          if (bestMatchIndex === -1 && slots.length > 0) {
            bestMatchIndex = slots.length - 1; // scroll to last if past all
          }

          if (bestMatchIndex !== -1 && timeSlotsDropdown.children.length > bestMatchIndex) {
            const itemToScroll = timeSlotsDropdown.children[
              bestMatchIndex
            ] as HTMLElement;
            
            if (itemToScroll) {
              itemToScroll.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          }
        }
      }, 10);
    }
  });

  function selectTime(slotDate: Date): void {
    let newDate = setHours(value, slotDate.getHours());
    newDate = setMinutes(newDate, slotDate.getMinutes());
    newDate = setSeconds(newDate, 0); // Clear seconds for consistency
    value = newDate;
    filterText = ""; // Clear filter text
    open = false; // Close dropdown after selection
    triggerButtonElement?.focus(); // Return focus to the input field
  }

  function tryAutoDetectTime(): boolean {
    const formatsToTry = ["h:mm aa", "HH:mm", "h:m aa", "H:m", "ha", "Ha", "h a", "H"];
    
    for (const fmt of formatsToTry) {
      try {
        // Use `value` as the reference date to keep the date part consistent
        const parsed = parseDateFns(filterText, fmt, value);
        if (isValidDate(parsed)) {
          // Update displayed time in the input field
          currentInputText = filterText;
          return true;
        }
      } catch (e) {
        /* Try next format */
      }
    }
    
    return false;
  }

  function parseAndSetTime(): void {
    const formatsToTry = ["h:mm aa", "HH:mm", "h:m aa", "H:m", "ha", "Ha", "h a", "H"];
    let parsedDateSuccessfully = false;

    for (const fmt of formatsToTry) {
      try {
        // Use `value` as the reference date to keep the date part consistent
        const parsed = parseDateFns(filterText || currentInputText, fmt, value);
        if (isValidDate(parsed)) {
          let newDate = setHours(value, parsed.getHours());
          newDate = setMinutes(newDate, parsed.getMinutes());
          newDate = setSeconds(newDate, 0);
          value = newDate;
          parsedDateSuccessfully = true;
          break; // Exit loop on successful parse
        }
      } catch (e) {
        /* Try next format */
      }
    }

    if (!parsedDateSuccessfully) {
      // If parsing fails for all formats, revert input to last valid time
      currentInputText = formatDateFns(value, "h:mm aa");
    }
    
    filterText = ""; // Clear filter after parsing
  }

  function handleInputFocus(): void {
    // Always ensure dropdown is open on focus
    open = true;
    setTimeout(() => {
      // Force scroll to selected time after DOM update
      if (timeSlotsDropdown) {
        const selectedItem = timeSlotsDropdown.querySelector<HTMLElement>('[data-selected="true"]');
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
    }, 10);
  }

  function handleInputBlur(): void {
    // Delay blur processing to allow click on dropdown items to register first
    setTimeout(() => {
      // Check if focus is still within the component (input or dropdown)
      const activeEl = document.activeElement;
      if (triggerButtonElement && timeSlotsDropdown) {
        if (
          activeEl !== triggerButtonElement &&
          !timeSlotsDropdown.contains(activeEl)
        ) {
          // If focus is outside both input and dropdown, parse and potentially close.
          if (open) {
            // If dropdown was open (i.e. not closed by selecting an item)
            parseAndSetTime(); // Parse the potentially manually typed time
            open = false; // Close dropdown
          }
        }
      } else if (open) {
        // Fallback if elements aren't bound yet (less likely but safe)
        parseAndSetTime();
        open = false;
      }
    }, 150); // Adjust delay if needed
  }

  function handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    filterText = input.value;
    currentInputText = input.value;
    
    // If input is empty, show all time slots
    if (!input.value) {
      filterText = "";
    }
  }

  function handleInputKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      parseAndSetTime();
      open = false; // Close dropdown
      triggerButtonElement?.blur(); // Remove focus to signify completion
    } else if (event.key === "Escape") {
      event.preventDefault();
      filterText = ""; // Clear filter
      currentInputText = formatDateFns(value, "h:mm aa"); // Revert input
      open = false; // Close dropdown
      triggerButtonElement?.blur();
    } else if (event.key === "ArrowDown") {
      if (open && timeSlotsDropdown?.firstChild) {
        event.preventDefault();
        (timeSlotsDropdown.firstChild as HTMLElement)?.focus();
      } else if (!open) {
        open = true; // Open dropdown if not already open
      }
    } else if (event.key === "Tab" && open) {
      // If tabbing out of input while dropdown is open, parse and close.
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
      const nextSibling = (event.target as HTMLElement)
        .nextElementSibling as HTMLElement | null;
      nextSibling?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const previousSibling = (event.target as HTMLElement)
        .previousElementSibling as HTMLElement | null;
      previousSibling?.focus();
    } else if (event.key === "Escape") {
      event.preventDefault();
      open = false;
      triggerButtonElement?.focus();
    } else if (event.key === "Tab") {
      event.preventDefault(); // Keep focus within dropdown or handle explicitly
      open = false;
      triggerButtonElement?.focus(); // Example: tab out of list goes back to input
    }
  }

  function isSelectedTime(slot: Date): boolean {
    return isSameHour(slot, value) && isSameMinute(slot, value);
  }

  function handleClickOutside(event: MouseEvent): void {
    if (open && timeSlotsDropdown && triggerButtonElement) {
      const target = event.target as Node;
      if (
        !timeSlotsDropdown.contains(target) &&
        !triggerButtonElement.contains(target)
      ) {
        parseAndSetTime(); // Parse if user typed something and clicked out
        open = false;
      }
    }
  }

  function toggleDropdown(): void {
    // Always open the dropdown when toggled from input
    open = true;
    setTimeout(() => {
      triggerButtonElement?.focus();
      triggerButtonElement?.select();
    }, 0);
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="relative w-full">
  <!-- Trigger Input -->
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
    placeholder="Select time"
  />

  {#if open}
    <div
      bind:this={timeSlotsDropdown}
      class="absolute mt-1 z-50 w-64 max-h-60 overflow-y-auto p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl"
      role="listbox"
      aria-labelledby={triggerButtonElement?.id || undefined}
    >
      <div class="text-sm font-semibold mb-2 px-2">
        {filterText ? `Matching times` : `Select time`}
      </div>
      
      {#if filteredTimeSlots.length === 0}
        <div class="text-sm text-center py-4 text-base-content/70">
          No matching times found
        </div>
      {:else}
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
      {/if}
    </div>
  {/if}
</div>