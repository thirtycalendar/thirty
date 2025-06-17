<script lang="ts">
  import { slide } from "svelte/transition";
  import { browser } from "$app/environment";

  import { Bolt, ChevronDown, Plus } from "@lucide/svelte";

  import { checkedCalendars } from "$lib/client/stores/checked-calendars";

  import type { Calendar } from "$lib/types";
  import { getColorHexCodeFromId } from "$lib/utils/colors";

  import { getCalList } from "../query";

  const { calendarList } = getCalList();

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

  const toggleCalendar = (title: string) => {
    collapsedCalendars[title] = !collapsedCalendars[title];
    if (browser) {
      localStorage.setItem("toggle-calendar-list", JSON.stringify(collapsedCalendars));
    }
  };

  const isChecked = (id: string) => {
    const storeVal = $checkedCalendars;
    return storeVal[id] ?? true;
  };

  const toggleChecked = (id: string) => {
    checkedCalendars.update((curr) => ({
      ...curr,
      [id]: !(curr[id] ?? true)
    }));
  };
</script>

{#if !$calendarList}
  <div class="relative h-[200px]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  </div>
{:else}
  {@render CalendarList("My Calendars", $calendarList)}
{/if}

{#snippet CalendarList(title: string, cal: Calendar[])}
  {#if cal.length > 0}
    <div class="my-2">
      <div
        class="flex items-center justify-between gap-1 px-1 text-sm font-semibold w-full rounded-md"
      >
        <p>{title}</p>

        <div>
          {#if title === "My Calendars"}
            <button class="btn btn-xs btn-ghost btn-square">
              <Plus size="16" />
            </button>
          {/if}

          <button
            class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${isExpanded(title) && "rotate-180"}`}
            onclick={() => toggleCalendar(title)}
          >
            <ChevronDown size="16" />
          </button>
        </div>
      </div>

      {#if $calendarList && isExpanded(title)}
        <div class="my-1" transition:slide>
          {#each cal as { id, name, colorId }}
            <label
              class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md"
            >
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs"
                  checked={isChecked(id)}
                  onchange={() => toggleChecked(id)}
                />
                <span
                  class="text-sm truncate max-w-[160px] text-ellipsis whitespace-nowrap"
                  style={`color: ${getColorHexCodeFromId(colorId)}`}
                >
                  {name}
                </span>
              </div>

              {#if title !== "Holidays"}
                <button
                  class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible"
                >
                  <Bolt size="15" />
                </button>
              {/if}
            </label>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{/snippet}
