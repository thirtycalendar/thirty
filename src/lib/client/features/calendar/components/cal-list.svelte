<script lang="ts">
  import { slide } from "svelte/transition";
  import { browser } from "$app/environment";

  import { Bolt, ChevronDown, Plus } from "@lucide/svelte";

  import { createQuery } from "$lib/client/utils/query/create-query";
  import { client } from "$lib/client/utils/rpc";

  import type { Calendar } from "$lib/types";

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

  let { data, isPending } = createQuery({
    queryFn: async () => {
      const res = await client.api.google.calendar.getAll.$get();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      return data.data;
    },
    queryKeys: ["cal-list"]
  });

  let owners = $derived(
    $data?.filter((c) => c.accessRole === "owner" && !/@gmail\.com$/i.test(c.id)) ?? []
  );
  let readers = $derived(
    $data?.filter((c) => c.accessRole === "reader" && !/holidays/i.test(c.summary)) ?? []
  );
  let holidays = $derived(
    $data
      ?.filter((c) => c.accessRole === "reader" && /holidays/i.test(c.summary))
      ?.map((c) => ({
        ...c,
        summary: c.summary.replace(/^Holidays in /i, "").trim()
      })) ?? []
  );
</script>

{#if $isPending}
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
          <button class="btn btn-xs btn-ghost btn-square">
            <Plus size="16" />
          </button>

          <button
            class={`btn btn-xs btn-ghost btn-square opacity-75 transition-transform duration-300 ${isExpanded(title) && "rotate-180"}`}
            onclick={() => toggleCalendar(title)}
          >
            <ChevronDown size="16" />
          </button>
        </div>
      </div>

      {#if $data && isExpanded(title)}
        <div class="my-1" transition:slide>
          {#each cal as { backgroundColor, summary }}
            {@render CalendarRow(backgroundColor, summary)}
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{/snippet}

{#snippet CalendarRow(backgroundColor: string, summary: string)}
  <label class="group flex justify-between items-center hover:bg-base-200 px-1 py-[2px] rounded-md">
    <div class="flex items-center gap-2">
      <input type="checkbox" class="checkbox checkbox-xs" />
      <span
        class="text-sm truncate max-w-[160px] text-ellipsis whitespace-nowrap"
        style={`color: ${backgroundColor}`}>{summary}</span
      >
    </div>
    <button class="btn btn-ghost btn-square btn-xs opacity-75 invisible group-hover:visible">
      <Bolt size="15" />
    </button>
  </label>
{/snippet}
