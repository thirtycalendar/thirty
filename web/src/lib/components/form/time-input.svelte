<script lang="ts">
  import { clickOutside } from "$lib/actions/on-click-outside";
  import { format, setHours, setMinutes, isValid, parse } from "date-fns";

  // The controlled value (a Date or null)
  export let value: Date | null = null;
  export let onChange: (v: Date | null) => void;

  let open = false;
  let input = "";

  // Generate 15-min interval time strings (e.g. "12:00 AM")
  const times = (() => {
    const arr = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const d = setMinutes(setHours(new Date(), h), m);
        arr.push(format(d, "hh:mm a"));
      }
    }
    return arr;
  })();

  // Reflect `value` as formatted string when it changes externally
  $: input = value ? format(value, "hh:mm a") : "";

  // Filtered dropdown based on input
  $: filtered = input
    ? times.filter((t) => t.toLowerCase().includes(input.toLowerCase()))
    : times;

  function onSelect(timeStr: string) {
    const parsed = parse(timeStr, "hh:mm a", new Date());
    if (isValid(parsed)) {
      value = parsed;
      onChange?.(value);
      input = format(value, "hh:mm a");
      open = false;
    }
  }

  // Validate free text input on blur or enter key
  function validateInput() {
    const parsed = parse(input.trim(), "hh:mm a", new Date());
    if (isValid(parsed)) {
      value = parsed;
      onChange?.(value);
      input = format(value, "hh:mm a");
    } else {
      // invalid input resets value to null but keeps raw input for UX
      value = null;
      onChange?.(null);
    }
  }

  // Keyboard support: Enter validates and closes dropdown
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      validateInput();
      open = false;
    } else if (e.key === "Escape") {
      open = false;
    }
  }
</script>

<div class="relative w-full" use:clickOutside={() => (open = false)}>
  <input
    type="text"
    class="w-full px-3 py-2 border border-base-300 rounded-md text-sm bg-base-100 hover:bg-base-200"
    placeholder="Select time"
    bind:value={input}
    on:focus={() => (open = true)}
    on:input={(e) => {
      input = e.currentTarget.value;
      open = true;
    }}
    on:blur={validateInput}
    on:keydown={onKeyDown}
    autocomplete="off"
    spellcheck="false"
  />

  {#if open && filtered.length > 0}
    <ul
      class="absolute z-50 w-full max-h-48 overflow-auto rounded-md border border-base-300 bg-base-100 shadow-lg mt-1 text-sm"
    >
      {#each filtered as time (time)}
        <button
          class="w-full text-left px-3 py-1 cursor-pointer hover:bg-base-300"
          on:mousedown|preventDefault={() => onSelect(time)}
        >
          {time}
        </button>
      {/each}
    </ul>
  {/if}
</div>
