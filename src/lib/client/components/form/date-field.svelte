<script lang="ts">
  import type { Writable } from "svelte/store";

  import {
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
    type Placement
  } from "@floating-ui/dom";
  import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

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
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths
  } from "date-fns";

  import { portal } from "$lib/client/actions/portal";
  import { cn } from "$lib/client/utils/cn";

  import { Icon } from "../icons";

  interface Props {
    name: string;
    class?: string;
    isDisablePast?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: Writable<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formErrors: Writable<any>;
    placement?: Placement;
  }

  let {
    name,
    class: classCn,
    isDisablePast = false,
    formData,
    formErrors,
    placement = "bottom-start"
  }: Props = $props();

  let triggerButton = $state<HTMLInputElement | null>(null);
  let calendarDropdown = $state<HTMLDivElement | null>(null);
  let open = $state(false);
  let filterText = $state("");

  let cleanup: (() => void) | null = null;

  let parsedDate = $derived.by(() => {
    const raw = $formData[name];
    const parsed = parse(raw, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : new Date();
  });

  let visibleMonth = $derived.by(() => startOfMonth(parsedDate));

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

  let error = $derived($formErrors[name]);

  let inputValue = $derived.by(() => {
    const date = parsedDate;
    const now = new Date();
    const sameYear = date.getFullYear() === now.getFullYear();
    const formatStr = sameYear ? "EEE d, MMM" : "EEE d, MMM yyyy";
    return open ? filterText : formatDate(date, formatStr);
  });

  function updatePosition() {
    if (!triggerButton || !calendarDropdown) return;
    computePosition(triggerButton, calendarDropdown, {
      placement,
      middleware: [offset(6), flip(), shift({ padding: 8 })]
    }).then(({ x, y }) => {
      Object.assign(calendarDropdown!.style, {
        left: `${x}px`,
        top: `${y}px`
      });
    });
  }

  $effect(() => {
    if (open && triggerButton && calendarDropdown) {
      cleanup = autoUpdate(triggerButton, calendarDropdown, updatePosition, {
        ancestorScroll: true,
        ancestorResize: true,
        elementResize: true,
        animationFrame: false
      });
      updatePosition();
    } else {
      cleanup?.();
      cleanup = null;
    }
  });

  function selectDay(day: Date) {
    const today = startOfDay(new Date());
    if (isDisablePast && day < today) return;
    $formData[name] = formatDate(day, "yyyy-MM-dd");
    visibleMonth = startOfMonth(day);
    filterText = "";
    open = false;
    triggerButton?.blur();
  }

  function commitInput() {
    const trimmed = filterText.trim();
    let parsed: Date | null = null;

    const formats = [
      "yyyy-MM-dd",
      "M/d/yyyy",
      "d-MMM-yyyy",
      "MMM d, yyyy",
      "MM/dd/yyyy",
      "M-d-yyyy"
    ];
    for (const fmt of formats) {
      const p = parse(trimmed, fmt, new Date());
      if (isValid(p)) {
        parsed = p;
        break;
      }
    }

    if (parsed) {
      $formData[name] = formatDate(parsed, "yyyy-MM-dd");
      visibleMonth = startOfMonth(parsed);
    }
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
      const today = startOfDay(new Date());
      if (!isDisablePast || d >= today) {
        $formData[name] = formatDate(d, "yyyy-MM-dd");
        visibleMonth = startOfMonth(d);
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
      const isOutside = !triggerButton?.contains(related) && !calendarDropdown?.contains(related);

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

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;
    if (!triggerButton?.contains(target) && !calendarDropdown?.contains(target)) {
      if (!filterText.trim()) {
        filterText = "";
        open = false;
      } else {
        commitInput();
      }
    }
  }

  function prevMonth() {
    const prev = subMonths(visibleMonth, 1);
    const now = new Date();
    if (!isDisablePast || startOfMonth(prev) >= startOfMonth(now)) {
      visibleMonth = startOfMonth(prev);
    }
  }

  function nextMonth() {
    visibleMonth = startOfMonth(addMonths(visibleMonth, 1));
  }
</script>

<svelte:window onmousedown={handleClickOutside} />

<div class={cn("relative w-full", classCn)}>
  <input
    type="text"
    aria-label="Date input"
    bind:this={triggerButton}
    value={inputValue}
    onfocus={() => {
      open = true;
      filterText = $formData[name] ? formatDate(parsedDate, "yyyy-MM-dd") : "";
    }}
    onblur={handleBlur}
    oninput={(e) => (filterText = (e.target as HTMLInputElement).value)}
    onkeydown={handleKeyDown}
    onclick={() => {
      open = true;
      triggerButton?.select();
    }}
    class={cn(
      "input hover:bg-base-200 w-full cursor-pointer border text-left outline-none focus:outline-none",
      error ? "border-error text-error" : "border-base-300 bg-base-100"
    )}
    autocomplete="off"
    placeholder="yyyy-MM-dd"
  />

  {#if error}
    <p class="text-error mt-1 text-xs">{error || "This field is required"}</p>
  {/if}

  {#if open}
    <div
      bind:this={calendarDropdown}
      use:portal
      class="border-base-300 bg-base-100 z-[9999] mt-1 w-72 rounded-xl border p-3 shadow-xl"
      role="dialog"
      tabindex="-1"
      style="position: absolute; top: 0; left: 0;"
    >
      <div class="mb-2 flex items-center justify-between px-2 text-sm font-semibold">
        <div>{formatDate(visibleMonth, "MMMM yyyy")}</div>
        <div class="flex gap-1">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            onclick={prevMonth}
            disabled={isDisablePast && startOfMonth(visibleMonth) <= startOfMonth(new Date())}
            aria-label="Previous Month"
          >
            <Icon icon={ArrowLeft01Icon} size={15} absoluteStrokeWidth />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square"
            onclick={nextMonth}
            aria-label="Next Month"
          >
            <Icon icon={ArrowRight01Icon} size={15} absoluteStrokeWidth />
          </button>
        </div>
      </div>

      <div class="mb-1 grid grid-cols-7 text-center text-[10px] opacity-50">
        {#each dayLabels as label, i (i)}
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
              "w-full rounded-md py-1 transition-colors outline-none",
              selected ? "bg-base-300 text-base-content font-semibold" : "",
              !isSameMonth(day, visibleMonth) ? "text-base-content/30" : "",
              isToday(day) && !selected ? "font-medium" : "",
              isDisablePast && day < startOfDay(new Date())
                ? "cursor-not-allowed opacity-30"
                : "hover:bg-base-200/60"
            )}
            disabled={isDisablePast && day < startOfDay(new Date())}
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
