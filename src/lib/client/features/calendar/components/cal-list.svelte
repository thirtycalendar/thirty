<script lang="ts">
  import { slide } from "svelte/transition";
  import { browser } from "$app/environment";

  import { ChevronDown, Plus, Settings } from "@lucide/svelte";

  import { toggleModal } from "$lib/client/components/utils";
  import { calendarCreateModalId, handleCalModal } from "$lib/client/stores/calendar";
  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import { getColorHexCodeFromId } from "$lib/shared/utils/colors";
  import type { Calendar } from "$lib/shared/types";

  import { getCalendars } from "../query";

  const { data: calendars } = getCalendars();

  const getToggledStates = (): Record<string, boolean> => {
    if (!browser) return {};
    try {
      return JSON.parse(localStorage.getItem("toggle-calendar-list") || "{}");
    } catch {
      return {};
    }
  };

  let collapsedCalendars = $state<Record<string, boolean>>(getToggledStates());

  const isExpanded = (title: string) => !collapsedCalendars[title];

  function toggleCalendar(title: string) {
    collapsedCalendars[title] = !collapsedCalendars[title];
    if (browser) {
      localStorage.setItem("toggle-calendar-list", JSON.stringify(collapsedCalendars));
    }
  }

  function isChecked(id: string) {
    const storeVal = $checkedCalendars;
    return storeVal[id] ?? true;
  }

  function toggleChecked(id: string) {
    checkedCalendars.update((curr) => ({
      ...curr,
      [id]: !(curr[id] ?? true)
    }));
  }
</script>

{#if !$calendars}
  <div class="relative h-[200px]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  </div>
{:else}
  {@render CalendarList("My Calendars", $calendars)}
{/if}

{#snippet CalendarList(title: string, cal: Calendar[])}
  <div class="my-2">
    <div
      class="flex items-center justify-between gap-1 px-1 text-sm font-semibold w-full rounded-md"
    >
      <p>{title}</p>

      <div class="flex items-center gap-1">
        <div class="tooltip font-normal" data-tip="New">
          <button
            class="btn btn-xs btn-ghost btn-square"
            onclick={() => toggleModal(calendarCreateModalId)}
          >
            <Plus size="16" />
          </button>
        </div>

        <button
          class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${isExpanded(title) && "rotate-180"}`}
          onclick={() => toggleCalendar(title)}
        >
          <ChevronDown size="16" />
        </button>
      </div>
    </div>

    {#if isExpanded(title) && cal.length > 0}
      <div class="my-1" transition:slide>
        {#each cal as c (c.id)}
          <label
            class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-xs"
                checked={isChecked(c.id)}
                onchange={() => toggleChecked(c.id)}
              />
              <span
                class="text-sm truncate max-w-[160px] text-ellipsis whitespace-nowrap"
                style={`color: ${getColorHexCodeFromId(c.colorId)}`}
              >
                {c.name}
              </span>
            </div>

            <button
              class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
              onclick={() => handleCalModal(c)}
            >
              <Settings size="15" />
            </button>
          </label>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}
