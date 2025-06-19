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
    data: any;
    className?: string;
    isRightDiv?: boolean;
  }

  let { name, data, className, isRightDiv = false }: TimeFieldProps = $props();

  let time: string = $derived($data[name]);

  let open = $state(false);
  let inputValue = $state("");
  let filterText = $state("");
  let triggerButtonElement: HTMLInputElement | undefined = $state();
  let timeSlotsDropdown: HTMLDivElement | undefined = $state();

  const timeSlotInterval = 15;

  function parseTimeProp(timeString: string): Date {
    const baseDate = new Date();

    // Normalize "12:37" -> "12:37:00"
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      timeString = `${timeString}:00`;
    }

    const parsed = parseDateFns(timeString, "HH:mm:ss", baseDate);
    return isValidDate(parsed) ? parsed : baseDate;
  }

  const currentDate = $derived(parseTimeProp(time));

  const allTimeSlots: Date[] = $derived.by(() => {
    const slots: Date[] = [];
    let slotTime = startOfDay(new Date());
    const totalSlots = (24 * 60) / timeSlotInterval;

    for (let i = 0; i < totalSlots; i++) {
      slots.push(slotTime);
      slotTime = addMinutesFns(slotTime, timeSlotInterval);
    }
    return slots;
  });

  const filteredTimeSlots: Date[] = $derived.by(() => {
    if (!filterText) return allTimeSlots;
    const lowercaseFilter = filterText.toLowerCase();
    return allTimeSlots.filter((slot) => {
      const timeString = formatDateFns(slot, "h:mm aa").toLowerCase();
      return timeString.includes(lowercaseFilter);
    });
  });

  $effect(() => {
    if (!open) {
      inputValue = formatDateFns(currentDate, "h:mm aa");
      filterText = "";
    }
  });

  $effect(() => {
    if (open && timeSlotsDropdown) {
      setTimeout(() => {
        if (!timeSlotsDropdown) return;

        const selectedItem = timeSlotsDropdown.querySelector<HTMLElement>('[data-selected="true"]');
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest" });
        } else {
          const currentHour = currentDate.getHours();
          const slotToScroll = filteredTimeSlots.findIndex(
            (slot) => slot.getHours() >= currentHour
          );
          const targetIndex = slotToScroll > -1 ? slotToScroll : 0;
          const targetElement = timeSlotsDropdown.children[0]?.children[targetIndex] as
            | HTMLElement
            | undefined;
          targetElement?.scrollIntoView({ block: "nearest" });
        }
      }, 10);
    }
  });

  function selectTime(slotDate: Date): void {
    $data[name] = formatDateFns(slotDate, "HH:mm");
    open = false;
    triggerButtonElement?.blur();
  }

  function commitInput(): void {
    const textToParse = (filterText || inputValue).trim().toLowerCase();
    let parsedDate: Date | null = null;

    if (/^\d+$/.test(textToParse)) {
      const num = parseInt(textToParse, 10);
      const baseDate = setSeconds(new Date(), 0);

      if (num === 12) {
        parsedDate = setHours(setMinutes(baseDate, 0), 0);
      } else if (num === 24) {
        parsedDate = setHours(setMinutes(baseDate, 0), 12);
      } else if (num >= 0 && num < 24) {
        parsedDate = setHours(setMinutes(baseDate, 0), num);
      }
    }

    if (!parsedDate && textToParse) {
      const formatsToTry = ["h:mm aa", "HH:mm", "h:m aa", "H:m", "ha", "h a"];
      for (const fmt of formatsToTry) {
        const parsed = parseDateFns(textToParse, fmt, new Date());
        if (isValidDate(parsed)) {
          parsedDate = parsed;
          break;
        }
      }
    }

    if (parsedDate) {
      $data[name] = formatDateFns(parsedDate, "HH:mm");
    } else {
      inputValue = formatDateFns(currentDate, "h:mm aa");
    }

    open = false;
    filterText = "";
    if (document.activeElement === triggerButtonElement) {
      triggerButtonElement?.blur();
    }
  }

  function handleFocus(): void {
    open = true;
  }

  function handleBlur(event: FocusEvent): void {
    setTimeout(() => {
      const relatedTarget = event.relatedTarget as Node | null;
      if (
        !triggerButtonElement?.contains(relatedTarget) &&
        !timeSlotsDropdown?.contains(relatedTarget)
      ) {
        open = false;
        commitInput();
      }
    }, 150);
  }

  function handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    filterText = target.value;
  }

  function handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        commitInput();
        break;
      case "Escape":
        event.preventDefault();
        open = false;
        filterText = "";
        inputValue = formatDateFns(currentDate, "h:mm aa");
        triggerButtonElement?.blur();
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
        if (open) {
          commitInput();
        }
        break;
    }
  }

  function handleSlotKeyDown(event: KeyboardEvent, slot: Date): void {
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

  function handleClickOutside(event: MouseEvent): void {
    if (open) {
      const target = event.target as Node;
      if (!triggerButtonElement?.contains(target) && !timeSlotsDropdown?.contains(target)) {
        open = false;
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
    bind:value={inputValue}
    onfocus={handleFocus}
    onblur={handleBlur}
    oninput={handleInput}
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
        isRightDiv ? "right-0" : "left-0",
        { hidden: filteredTimeSlots.length === 0 }
      )}
      role="listbox"
    >
      <div class="space-y-0.5">
        {#each filteredTimeSlots as slot (formatDateFns(slot, "HH:mm"))}
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
            {formatDateFns(slot, "h:mm aa")}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
