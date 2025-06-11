<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths
  } from "date-fns";

  interface CalendarFieldProps {
    name: string;
    formData: any;
    formErrors: any;
    handleInput: (event: Event) => void;
  }

  let { name, formData, formErrors, handleInput }: CalendarFieldProps = $props();

  let value = $derived($formData[name] ?? new Date());
  let error = $derived($formData[name]);

  let open = $state(false);
  let calendarDropdown = $state<HTMLDivElement | undefined>(undefined);
  let triggerButton = $state<HTMLButtonElement | undefined>(undefined);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const getDays = () => {
    const start = startOfWeek(startOfMonth(value), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(value), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  };

  function selectDay(day: Date) {
    value = day;
    open = false;

    // Return focus to the button after selection
    setTimeout(() => {
      if (triggerButton) {
        triggerButton.focus();
      }
    }, 0);
  }

  function prevMonth() {
    value = subMonths(value, 1);
  }

  function nextMonth() {
    value = addMonths(value, 1);
  }

  function handleClickOutside(event: MouseEvent): void {
    if (!open) return;

    if (calendarDropdown && triggerButton) {
      const target = event.target as Node;
      if (!calendarDropdown.contains(target) && !triggerButton.contains(target)) {
        open = false;
      }
    }
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      open = false;
      triggerButton?.focus();
    }
  }

  function handleDayKeydown(event: KeyboardEvent, day: Date): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDay(day);
    } else if (event.key === "Escape") {
      event.preventDefault();
      open = false;
      triggerButton?.focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const nextDay = addDays(day, 1);
      value = nextDay;
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prevDay = addDays(day, -1);
      value = prevDay;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevWeekDay = addDays(day, -7);
      value = prevWeekDay;
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextWeekDay = addDays(day, 7);
      value = nextWeekDay;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="relative w-full">
  <!-- Trigger Button -->
  <button
    type="button"
    bind:this={triggerButton}
    class="w-full px-3 py-2 border border-base-300 rounded-md text-sm bg-base-100 hover:bg-base-200 text-left"
    onclick={() => (open = true)}
    onkeydown={(e) => {
      if ((e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && !open) {
        e.preventDefault();
        open = true;
      }
    }}
    aria-haspopup="dialog"
    aria-expanded={open}
  >
    {format(value, "EEE d, MMM")}
  </button>

  {#if open}
    <div
      bind:this={calendarDropdown}
      class="absolute mt-1 z-50 w-72 p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl"
    >
      <!-- Month Navigation -->
      <div class="flex items-center justify-between px-2 mb-2 text-sm font-semibold">
        <div class=" w-full">
          {format(value, "MMMM yyyy")}
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-xs btn-square"
          onclick={prevMonth}
          onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              prevMonth();
            }
          }}
          aria-label="Previous Month"
          tabindex="0"
        >
          <ChevronLeft size="15" />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-xs btn-square"
          onclick={nextMonth}
          onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              nextMonth();
            }
          }}
          aria-label="Next Month"
          tabindex="0"
        >
          <ChevronRight size="15" />
        </button>
      </div>

      <!-- Day Labels -->
      <div class="grid grid-cols-7 text-[10px] text-center opacity-50 mb-1">
        {#each dayLabels as label}
          <div>{label}</div>
        {/each}
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        {#each getDays() as day}
          <button
            type="button"
            class={`py-1 rounded-md cursor-pointer transition-colors w-full
              ${isSameDay(day, value) ? "bg-base-200 text-primary-content font-semibold" : ""}
              ${!isSameMonth(day, value) ? "text-base-content/30" : ""}
              ${isToday(day) && isSameDay(day, value) ? "text-primary font-medium" : ""}
              hover:bg-base-300/60`}
            onclick={(e) => {
              e.preventDefault();
              selectDay(day);
            }}
            onkeydown={(e) => handleDayKeydown(e, day)}
            tabindex="0"
            role="gridcell"
            aria-selected={isSameDay(day, value)}
          >
            {format(day, "d")}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
