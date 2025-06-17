<script lang="ts">
  import { get } from "svelte/store";
  import { slide } from "svelte/transition";
  import { browser } from "$app/environment";

  import { Bolt, ChevronDown, Plus } from "@lucide/svelte";

  import { checkedCalendars } from "$lib/client/stores/checked-calendars";
  import { session } from "$lib/client/stores/user-session";

  import type { Calendar } from "$lib/types";

  import { calendarList, isCalendarListPending } from "../../queries/calendar-list";
  import { isColorListPending } from "../../queries/color-list";
  import { getCalendarColor } from "../../utils/get-colors";

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
    const storeVal = get(checkedCalendars);
    return storeVal[id] ?? true;
  };

  const toggleChecked = (id: string) => {
    checkedCalendars.update((curr) => ({
      ...curr,
      [id]: !(curr[id] ?? true)
    }));
  };

  let owners = $derived(
    $calendarList
      ?.filter((c) => c.accessRole === "owner")
      ?.map((c) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.summary);
        return {
          ...c,
          summary: isEmail ? ($session?.name ?? c.summary) : c.summary
        };
      }) ?? []
  );

  let readers = $derived(
    $calendarList?.filter((c) => c.accessRole === "reader" && !/holidays/i.test(c.summary)) ?? []
  );

  let holidays = $derived(
    $calendarList
      ?.filter((c) => c.accessRole === "reader" && /holidays/i.test(c.summary))
      ?.map((c) => ({
        ...c,
        summary: c.summary.replace(/^Holidays in /i, "").trim()
      })) ?? []
  );
</script>

{#if $isCalendarListPending || $isColorListPending}
  <div class="relative h-[200px]">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3">
      <span class="loading loading-spinner loading-md"></span>
    </div>
  </div>
{:else}
  {@render CalendarList("My Calendars", owners)}
  {@render CalendarList("Others", readers)}
  {@render CalendarList("Holidays", holidays)}
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
          {#each cal as { id, colorId, summary }}
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
                  style={`color: ${getCalendarColor(colorId)}`}
                >
                  {summary}
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
