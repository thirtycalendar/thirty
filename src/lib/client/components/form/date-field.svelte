<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format as formatDate,
    isSameDay,
    isSameMonth,
    isToday,
    isValid,
    parse,
    startOfMonth,
    startOfWeek,
    subMonths
  } from "date-fns";

  import { cn } from "$lib/client/utils/cn";

  interface DateFieldProps {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    isDisablePast?: boolean;
    className?: string;
  }

  let { name, data, isDisablePast = false, className }: DateFieldProps = $props();

  let triggerButton = $state<HTMLInputElement | undefined>();
  let calendarDropdown = $state<HTMLDivElement | undefined>();
  let open = $state(false);
  let filterText = $state("");

  let parsedDate = $derived.by(() => {
    const raw = $data[name];
    const parsed = parse(raw, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : new Date();
  });

  let inputValue = $derived.by(() =>
    open ? filterText || formatDate(parsedDate, "EEE d, MMM") : formatDate(parsedDate, "EEE d, MMM")
  );

  let visibleMonth = $derived(parsedDate);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  let getDays = $derived.by(() => {
    const start = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 0 });
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }
    return days;
  });

  function selectDay(day: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isDisablePast && day < today) return;
    $data[name] = formatDate(day, "yyyy-MM-dd");
    filterText = "";
    open = false;
    triggerButton?.blur();
  }

  function commitInput() {
    const trimmed = filterText.trim();
    const parsed = parse(trimmed, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) $data[name] = formatDate(parsed, "yyyy-MM-dd");
    filterText = "";
    open = false;
    triggerButton?.blur();
  }

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        commitInput();
        break;
      case "Escape":
        open = false;
        filterText = "";
        break;
      case "ArrowDown":
        event.preventDefault();
        if (open) {
          const cell = calendarDropdown?.querySelector('[role="gridcell"]:not(:disabled)');
          if (cell instanceof HTMLElement) cell.focus();
        } else {
          open = true;
        }
        break;
      case "Tab":
        if (open) commitInput();
        break;
    }
  }

  function handleDayKeydown(event: KeyboardEvent, day: Date) {
    const move = (d: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!isDisablePast || d >= today) {
        $data[name] = formatDate(d, "yyyy-MM-dd");
      }
    };

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        selectDay(day);
        break;
      case "ArrowRight":
        event.preventDefault();
        move(addDays(day, 1));
        break;
      case "ArrowLeft":
        event.preventDefault();
        move(addDays(day, -1));
        break;
      case "ArrowDown":
        event.preventDefault();
        move(addDays(day, 7));
        break;
      case "ArrowUp":
        event.preventDefault();
        move(addDays(day, -7));
        break;
      case "Escape":
      case "Tab":
        open = false;
        triggerButton?.focus();
        break;
    }
  }

  function handleBlur(event: FocusEvent) {
    setTimeout(() => {
      const related = event.relatedTarget as Node;
      if (!triggerButton?.contains(related) && !calendarDropdown?.contains(related)) {
        commitInput();
      }
    }, 100);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!triggerButton?.contains(target) && !calendarDropdown?.contains(target)) {
      commitInput();
    }
  }

  function prevMonth() {
    const prev = subMonths(visibleMonth, 1);
    const now = new Date();
    if (!isDisablePast || startOfMonth(prev) >= startOfMonth(now)) {
      $data[name] = formatDate(prev, "yyyy-MM-dd");
    }
  }

  function nextMonth() {
    const next = addMonths(visibleMonth, 1);
    $data[name] = formatDate(next, "yyyy-MM-dd");
  }
</script>

<svelte:window onmousedown={handleClickOutside} />

<div class={cn("relative w-full", className)}>
  <input
    type="text"
    aria-label="Date input"
    bind:this={triggerButton}
    value={inputValue}
    onfocus={() => (open = true)}
    onblur={handleBlur}
    oninput={(e) => (filterText = (e.target as HTMLInputElement).value)}
    onkeydown={handleKeyDown}
    onclick={() => {
      open = true;
      triggerButton?.select();
    }}
    class="w-full cursor-pointer rounded-md border border-base-300 bg-base-100 px-3 py-2 text-left text-sm outline-none hover:bg-base-200"
    autocomplete="off"
    placeholder="yyyy-MM-dd"
  />

  {#if open}
    <div
      bind:this={calendarDropdown}
      class="absolute z-50 mt-1 w-72 p-3 rounded-xl border border-base-300 bg-base-100 shadow-xl"
    >
      <div class="flex items-center justify-between mb-2 px-2 text-sm font-semibold">
        <div>{formatDate(visibleMonth, "MMMM yyyy")}</div>
        <div class="flex gap-1">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            onclick={prevMonth}
            disabled={isDisablePast && startOfMonth(visibleMonth) <= startOfMonth(new Date())}
            aria-label="Previous Month"
          >
            <ChevronLeft size="15" />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            onclick={nextMonth}
            aria-label="Next Month"
          >
            <ChevronRight size="15" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 text-[10px] text-center opacity-50 mb-1">
        {#each dayLabels as label}
          <div>{label}</div>
        {/each}
      </div>

      <div class="grid grid-cols-7 gap-1 text-center text-sm">
        {#each getDays as day (formatDate(day, "yyyy-MM-dd"))}
          {@const selected = isSameDay(day, parsedDate)}
          <button
            type="button"
            role="gridcell"
            aria-selected={selected}
            class={cn(
              "py-1 rounded-md w-full transition-colors outline-none",
              selected ? "bg-base-300 font-semibold text-base-content" : "",
              !isSameMonth(day, visibleMonth) ? "text-base-content/30" : "",
              isToday(day) && !selected ? "font-medium" : "",
              isDisablePast && day < new Date(new Date().setHours(0, 0, 0, 0))
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-base-200/60"
            )}
            disabled={isDisablePast && day < new Date(new Date().setHours(0, 0, 0, 0))}
            onkeydown={(e) => handleDayKeydown(e, day)}
            onclick={() => selectDay(day)}
            tabindex="-1"
          >
            {formatDate(day, "d")}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
