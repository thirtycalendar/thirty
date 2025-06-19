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

  import { cn } from "$lib/client/utils/cn";

  interface CalendarFieldProps {
    name: string;
    data: any;
    isDisablePast?: boolean;
    className?: string;
  }

  let { name, data, isDisablePast, className }: CalendarFieldProps = $props();

  let date = $derived($data[name]);
  let open = $state(false);
  let calendarDropdown = $state<HTMLDivElement | undefined>(undefined);
  let triggerButton = $state<HTMLButtonElement | undefined>(undefined);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  const getDays = () => {
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  };

  function selectDay(day: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isDisablePast && day < today) return;

    date = day.toISOString();

    open = false;
    setTimeout(() => triggerButton?.focus(), 0);
  }

  function prevMonth() {
    const prev = subMonths(date, 1);
    const now = new Date();
    const startOfPrev = startOfMonth(prev);
    const startOfNow = startOfMonth(now);

    if (!isDisablePast || startOfPrev >= startOfNow) {
      date = prev.toISOString();
    }
  }

  function nextMonth() {
    date = addMonths(date, 1).toISOString();
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
    const navigate = (target: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!isDisablePast || target >= today) {
        date = target.toISOString();
      }
    };

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDay(day);
    } else if (event.key === "Escape") {
      event.preventDefault();
      open = false;
      triggerButton?.focus();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(addDays(day, 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(addDays(day, -1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      navigate(addDays(day, -7));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      navigate(addDays(day, 7));
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class={cn("relative w-full", className)}>
  <button
    type="button"
    bind:this={triggerButton}
    class="w-full px-3 py-2 border border-base-300 rounded-md text-sm bg-base-100 hover:bg-base-200 text-left outline-none"
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
    {format(date, "EEE d, MMM")}
  </button>

  {#if open}
    <div
      bind:this={calendarDropdown}
      class="absolute mt-1 z-50 w-72 p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl"
    >
      <div class="flex items-center justify-between px-2 mb-2 text-sm font-semibold">
        <div class=" w-full">
          {format(date, "MMMM yyyy")}
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-xs btn-square outline-none"
          onclick={prevMonth}
          disabled={isDisablePast && startOfMonth(date) <= startOfMonth(new Date())}
          aria-label="Previous Month"
        >
          <ChevronLeft size="15" />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-xs btn-square outline-none"
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

      <div class="grid grid-cols-7 text-[10px] text-center opacity-50 mb-1">
        {#each dayLabels as label}
          <div>{label}</div>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        {#each getDays() as day}
          <button
            type="button"
            class={`py-1 rounded-md cursor-pointer transition-colors w-full outline-none
              ${isSameDay(day, date) ? "bg-base-200 text-primary-content font-semibold" : ""}
              ${!isSameMonth(day, date) ? "text-base-content/30" : ""}
              ${isToday(day) && isSameDay(day, date) ? "text-primary font-medium" : ""}
              ${isDisablePast && day < new Date(new Date().setHours(0, 0, 0, 0)) ? "opacity-30 cursor-not-allowed" : "hover:bg-base-300/60"}
            `}
            onclick={(e) => {
              e.preventDefault();
              selectDay(day);
            }}
            onkeydown={(e) => handleDayKeydown(e, day)}
            tabindex="0"
            role="gridcell"
            aria-selected={isSameDay(day, date)}
            disabled={isDisablePast && day < new Date(new Date().setHours(0, 0, 0, 0))}
          >
            {format(day, "d")}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
